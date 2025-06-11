// 每页显示的游戏数量
const GAMES_PER_PAGE = 12;

// 当前页码
let currentPage = 1;

// 所有游戏数据
let allGames = [];

// 从JSON文件加载游戏数据
async function loadGames() {
    try {
        const response = await fetch('game_data.json');
        allGames = await response.json();
        displayGames();
        setupPagination();
    } catch (error) {
        console.error('加载游戏数据失败:', error);
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

// 显示游戏
function displayGames() {
    const gamesGrid = document.querySelector('.games-grid');
    const startIndex = (currentPage - 1) * GAMES_PER_PAGE;
    const endIndex = startIndex + GAMES_PER_PAGE;
    const currentGames = allGames.slice(startIndex, endIndex);
    
    gamesGrid.innerHTML = '';
    
    currentGames.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
            <img src="${game.thumb}" alt="${game.title}" class="game-thumb">
            <div class="game-info">
                <h3>${game.title}</h3>
                <p>${game.description.slice(0, 100)}...</p>
            </div>
        `;
        
        // 添加点击事件，跳转到游戏详情页
        gameCard.addEventListener('click', () => {
            window.location.href = `game.html?id=${game.game_id}`;
        });
        
        gamesGrid.appendChild(gameCard);
    });
}

// 设置分页
function setupPagination() {
    const totalPages = Math.ceil(allGames.length / GAMES_PER_PAGE);
    const pagination = document.querySelector('.pagination');
    
    // 清空现有分页按钮
    pagination.innerHTML = '';
    
    // 添加"上一页"按钮
    const prevButton = document.createElement('button');
    prevButton.className = 'pagination-button';
    prevButton.textContent = '上一页';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayGames();
            setupPagination();
        }
    });
    pagination.appendChild(prevButton);
    
    // 添加页码按钮
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `pagination-button ${i === currentPage ? 'active' : ''}`;
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayGames();
            setupPagination();
        });
        pagination.appendChild(pageButton);
    }
    
    // 添加"下一页"按钮
    const nextButton = document.createElement('button');
    nextButton.className = 'pagination-button';
    nextButton.textContent = '下一页';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayGames();
            setupPagination();
        }
    });
    pagination.appendChild(nextButton);
}

// 搜索功能
const searchInput = document.querySelector('.search-input');
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    allGames = allGames.filter(game => 
        game.title.toLowerCase().includes(searchTerm) ||
        game.description.toLowerCase().includes(searchTerm)
    );
    currentPage = 1;
    displayGames();
    setupPagination();
});

// 分类标签点击事件
const categoryTags = document.querySelectorAll('.category-tag');
categoryTags.forEach(tag => {
    tag.addEventListener('click', () => {
        // 移除所有标签的 active 类
        categoryTags.forEach(t => t.classList.remove('active'));
        // 添加当前标签的 active 类
        tag.classList.add('active');
        
        const category = tag.textContent;
        if (category === '全部') {
            loadGames(); // 重新加载所有游戏
        } else {
            // 根据分类筛选游戏
            allGames = allGames.filter(game => 
                game.description.toLowerCase().includes(category.toLowerCase())
            );
            currentPage = 1;
            displayGames();
            setupPagination();
        }
    });
});

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