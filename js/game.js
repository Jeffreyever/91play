// 从 URL 获取游戏 ID
const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get('id');

// 加载游戏数据
async function loadGameData() {
    try {
        const response = await fetch('../game_data.json');
        const games = await response.json();
        const game = games.find(g => g.game_id === gameId);
        
        if (game) {
            displayGame(game);
        } else {
            console.error('Game not found');
            // 重定向到游戏列表页
            window.location.href = 'games.html';
        }
    } catch (error) {
        console.error('Error loading game data:', error);
        // 重定向到游戏列表页
        window.location.href = 'games.html';
    }
}

// 显示游戏信息
function displayGame(game) {
    // 更新页面标题
    document.title = `${game.title} - 91play`;
    
    // 更新游戏标题
    document.querySelector('.game-title').textContent = game.title;
    
    // 更新游戏描述
    document.querySelector('.game-description').textContent = game.description;
    
    // 更新游戏说明
    document.querySelector('.game-instructions p').textContent = game.instructions;
    
    // 创建并插入游戏 iframe
    const iframe = document.createElement('iframe');
    iframe.src = game.iframe_url;
    iframe.width = game.width;
    iframe.height = game.height;
    iframe.scrolling = 'no';
    iframe.frameBorder = '0';
    
    document.querySelector('.game-container').appendChild(iframe);
}

// 页面加载时执行
document.addEventListener('DOMContentLoaded', loadGameData); 