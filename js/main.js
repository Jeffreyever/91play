// 从JSON文件加载游戏数据
async function loadGames() {
    try {
        const response = await fetch('game_data.json');
        const games = await response.json();
        return games;
    } catch (error) {
        console.error('加载游戏数据失败:', error);
        return [];
    }
}

// 创建游戏卡片HTML
function createGameCard(game) {
    return `
        <div class="game-card">
            <img src="${game.thumb || 'placeholder.jpg'}" alt="${game.title}">
            <div class="game-info">
                <h3 class="game-title">${game.title}</h3>
                <p class="game-description">${game.description}</p>
                <a href="game.html?id=${game.game_id}" class="game-button">开始游戏</a>
            </div>
        </div>
    `;
}

// 渲染游戏列表
async function renderGames(container, games, start = 0, limit = 12) {
    const gamesContainer = document.querySelector(container);
    if (!gamesContainer) return;

    const gameSlice = games.slice(start, start + limit);
    const gamesHTML = gameSlice.map(createGameCard).join('');
    gamesContainer.innerHTML = gamesHTML;
}

// 搜索游戏
function searchGames(games, query) {
    return games.filter(game => 
        game.title.toLowerCase().includes(query.toLowerCase()) ||
        game.description.toLowerCase().includes(query.toLowerCase())
    );
}

// 按分类过滤游戏
function filterGamesByCategory(games, category) {
    if (category === '全部') return games;
    return games.filter(game => game.type === category);
}

// 初始化页面
async function initializePage() {
    const games = await loadGames();
    
    // 处理搜索
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const filteredGames = searchGames(games, e.target.value);
            renderGames('.games-grid', filteredGames);
        });
    }

    // 处理分类标签点击
    const categoryTags = document.querySelectorAll('.category-tag');
    categoryTags.forEach(tag => {
        tag.addEventListener('click', () => {
            // 更新活动状态
            categoryTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');

            // 过滤并显示游戏
            const category = tag.textContent;
            const filteredGames = filterGamesByCategory(games, category);
            renderGames('.games-grid', filteredGames);
        });
    });

    // 处理分页
    const paginationButtons = document.querySelectorAll('.pagination-button');
    if (paginationButtons.length) {
        paginationButtons.forEach((button, index) => {
            if (button.textContent === '上一页' || button.textContent === '下一页') {
                button.addEventListener('click', () => {
                    const currentPage = parseInt(document.querySelector('.pagination-button.active').textContent);
                    const newPage = button.textContent === '上一页' ? currentPage - 1 : currentPage + 1;
                    if (newPage > 0 && newPage <= Math.ceil(games.length / 12)) {
                        renderGames('.games-grid', games, (newPage - 1) * 12);
                        updatePagination(newPage);
                    }
                });
            } else {
                button.addEventListener('click', () => {
                    const page = parseInt(button.textContent);
                    renderGames('.games-grid', games, (page - 1) * 12);
                    updatePagination(page);
                });
            }
        });
    }

    // 初始化页面内容
    const currentPath = window.location.pathname;
    if (currentPath.includes('index.html') || currentPath === '/') {
        // 首页显示推荐游戏和最新游戏
        const recommendedGames = games.slice(0, 6);
        const latestGames = [...games].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
        
        const recommendedContainer = document.querySelector('.games-grid');
        const latestContainer = document.querySelectorAll('.games-grid')[1];
        
        if (recommendedContainer) renderGames('.games-grid', recommendedGames);
        if (latestContainer) renderGames('.games-grid:nth-child(2)', latestGames);
    } else if (currentPath.includes('games.html')) {
        // 游戏列表页显示所有游戏
        renderGames('.games-grid', games);
    } else if (currentPath.includes('categories.html')) {
        // 分类页面显示各类游戏
        const categories = ['动作', '益智', '策略', '模拟', '休闲', '冒险'];
        categories.forEach(category => {
            const categoryGames = filterGamesByCategory(games, category);
            renderGames(`section:contains('${category}') .games-grid`, categoryGames, 0, 6);
        });
    }

    // 更新页面标题
    document.title = `${games[0].title} - 91play`;
}

// 更新分页按钮状态
function updatePagination(currentPage) {
    const buttons = document.querySelectorAll('.pagination-button');
    buttons.forEach(button => {
        button.classList.remove('active');
        if (button.textContent === currentPage.toString()) {
            button.classList.add('active');
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initializePage); 