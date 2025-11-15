// Eco-City Simulator - Главный файл
console.log('🚀 Eco-City Simulator загружается...');

class SimpleGame {
    constructor() {
        this.money = 1000;
        this.population = 10;
        this.workers = 3;
    }
    
    init() {
        console.log('🎮 Игра инициализирована!');
        this.updateUI();
        this.setupEventListeners();
    }
    
    updateUI() {
        document.getElementById('player-money').textContent = this.money;
        document.getElementById('player-population').textContent = this.population;
        document.getElementById('quick-income').textContent = '125/день';
        document.getElementById('quick-happiness').textContent = '75%';
    }
    
    setupEventListeners() {
        // Навигация по вкладкам
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.showTab(tab);
            });
        });
        
        // Кнопка сохранения
        document.getElementById('save-btn').addEventListener('click', () => {
            this.saveGame();
        });
    }
    
    showTab(tabName) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        const messages = {
            'settlement': '🏘️ Управление городом',
            'workers': '👤 Управление рабочими', 
            'inventory': '🎒 Инвентарь',
            'crafting': '🛠️ Крафтинг',
            'research': '🔬 Исследования'
        };
        
        const tabContent = document.getElementById('tab-content');
        tabContent.innerHTML = `
            <div class="glass-card">
                <h2>${messages[tabName] || tabName}</h2>
                <p>Этот раздел находится в разработке</p>
                <div class="coming-soon">🚧 Скоро будет доступно!</div>
            </div>
        `;
    }
    
    saveGame() {
        alert('💾 Игра сохранена!');
        console.log('Игра сохранена');
    }
}

// Запуск игры когда страница загрузится
document.addEventListener('DOMContentLoaded', () => {
    // Скрываем экран загрузки
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('game-container').style.display = 'block';
        
        // Запускаем игру
        const game = new SimpleGame();
        game.init();
        
        console.log('✅ Eco-City Simulator запущен!');
    }, 2000);
});
