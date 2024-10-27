// Общие утилиты для всех режимов
function createCard(rank, suit) {
    const card = document.createElement('div');
    card.className = 'card';
    card.textContent = `${rank}${suit}`;
    if (suit === '♥' || suit === '♦') {
        card.classList.add('red');
    }
    return card;
}

function clearBoard(boardElement) {
    ['front-row', 'mid-row', 'back-row'].forEach(rowClass => {
        const row = boardElement.querySelector(`.${rowClass}`);
        row.innerHTML = '';
    });
}

function updateBoard(boardElement, boardData) {
    clearBoard(boardElement);
    
    // Обновление каждого ряда
    if (boardData.front) {
        const frontRow = boardElement.querySelector('.front-row');
        boardData.front.forEach(card => {
            frontRow.appendChild(createCard(card.rank, card.suit));
        });
    }
    
    if (boardData.mid) {
        const midRow = boardElement.querySelector('.mid-row');
        boardData.mid.forEach(card => {
            midRow.appendChild(createCard(card.rank, card.suit));
        });
    }
    
    if (boardData.back) {
        const backRow = boardElement.querySelector('.back-row');
        boardData.back.forEach(card => {
            backRow.appendChild(createCard(card.rank, card.suit));
        });
    }
}

// Обработка ошибок
function handleError(error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
}

// Форматирование времени
function formatTime(seconds) {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
}
