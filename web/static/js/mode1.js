const socket = io();
let trainingActive = false;

document.getElementById('start-training').addEventListener('click', () => {
    trainingActive = true;
    socket.emit('start_game', {
        mode: 'ai_vs_ai'
    });
    updateControlButtons();
});

document.getElementById('pause-training').addEventListener('click', () => {
    trainingActive = false;
    socket.emit('pause_training');
    updateControlButtons();
});

document.getElementById('download-progress').addEventListener('click', () => {
    window.location.href = '/download_progress';
});

function updateControlButtons() {
    document.getElementById('start-training').disabled = trainingActive;
    document.getElementById('pause-training').disabled = !trainingActive;
}

socket.on('training_update', (data) => {
    // Обновление статистики
    document.getElementById('games-count').textContent = data.gamesPlayed;
    document.getElementById('win-rate').textContent = data.winRate + '%';

    // Обновление досок
    data.boards.forEach((board, index) => {
        updatePlayerBoard(index, board);
    });
});

function updatePlayerBoard(playerIndex, board) {
    const boardElement = document.getElementById(`ai-player-${playerIndex}`);
    
    // Обновление карт в каждом ряду
    updateRow(boardElement.querySelector('.front-row'), board.front);
    updateRow(boardElement.querySelector('.mid-row'), board.mid);
    updateRow(boardElement.querySelector('.back-row'), board.back);
    
    // Обновление счета
    boardElement.querySelector('.player-score').textContent = board.score;
}

function updateRow(rowElement, cards) {
    rowElement.innerHTML = '';
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.textContent = card;
        if (card.includes('♥') || card.includes('♦')) {
            cardElement.classList.add('red');
        }
        rowElement.appendChild(cardElement);
    });
}
