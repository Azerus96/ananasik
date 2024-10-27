const socket = io();
let selectedCardSlot = null;
let selectedRank = null;
let selectedSuit = null;

// Инициализация слотов для карт
document.querySelectorAll('.card-slot').forEach(slot => {
    slot.addEventListener('click', () => {
        if (slot.closest('.input-row')) {
            selectedCardSlot = slot;
            highlightSelectedSlot(slot);
        }
    });
});

// Обработчики для кнопок рангов и мастей
document.querySelectorAll('.rank-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        selectedRank = btn.dataset.rank;
        if (selectedCardSlot && selectedSuit) {
            placeCard();
        }
    });
});

document.querySelectorAll('.suit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        selectedSuit = btn.dataset.suit;
        if (selectedCardSlot && selectedRank) {
            placeCard();
        }
    });
});

// Размещение карты
function placeCard() {
    if (selectedCardSlot && selectedRank && selectedSuit) {
        const card = `${selectedRank}${selectedSuit}`;
        selectedCardSlot.textContent = card;
        selectedCardSlot.dataset.card = card;
        
        // Сброс выбора
        selectedCardSlot = null;
        selectedRank = null;
        selectedSuit = null;
        removeHighlights();
    }
}

// Кнопка "Распределить"
document.getElementById('distribute-btn').addEventListener('click', () => {
    const inputCards = [];
    document.querySelectorAll('.input-row .card-slot').forEach(slot => {
        if (slot.dataset.card) {
            inputCards.push(slot.dataset.card);
        }
    });

    const knownCards = [];
    document.querySelectorAll('.known-cards-row .card-slot').forEach(slot => {
        if (slot.dataset.card) {
            knownCards.push(slot.dataset.card);
        }
    });

    const timeLimit = document.getElementById('time-limit').value;

    socket.emit('distribute_cards', {
        inputCards: inputCards,
        knownCards: knownCards,
        timeLimit: parseInt(timeLimit)
    });
});

// Обработка ответа от сервера
socket.on('distribution_result', (data) => {
    const {front, mid, back} = data.distribution;
    
    // Размещение карт на доске
    placeFrontCards(front);
    placeMidCards(mid);
    placeBackCards(back);
});

function placeFrontCards(cards) {
    const slots = document.querySelectorAll('.front-row .card-slot');
    cards.forEach((card, i) => {
        slots[i].textContent = card;
        slots[i].dataset.card = card;
    });
}

function placeMidCards(cards) {
    const slots = document.querySelectorAll('.mid-row .card-slot');
    cards.forEach((card, i) => {
        slots[i].textContent = card;
        slots[i].dataset.card = card;
    });
}

function placeBackCards(cards) {
    const slots = document.querySelectorAll('.back-row .card-slot');
    cards.forEach((card, i) => {
        slots[i].textContent = card;
        slots[i].dataset.card = card;
    });
}
