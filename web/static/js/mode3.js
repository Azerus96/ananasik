const socket = io();
let gameActive = false;

document.getElementById('start-game').addEventListener('click', () => {
    const aiCount = document.getElementById('ai-players-count').value;
    
    socket.emit('start_game', {
        mode: 'human_vs_ai',
        aiPlayers: parseInt(aiCount)
    });
    
    // Показываем нужное количество досок ИИ
    document.querySelectorAll('.ai-board').forEach((board, index) => {
        board.style.display = index < aiCount ? 'block' : 'none';
    });
    
    gameActive = true;
    updateControls();
});

socket.on('game_update', (data) => {
    // Обновление всех досок
    updatePlayerBoard('human', data.humanBoard);
    data.aiBoards.forEach((board, index) => {
        updatePlayerBoard(`ai-player-${index}`, board);
    });
});

// Остальные функции такие же, как в mode2.js
