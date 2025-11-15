import { WorkersSystem } from '../systems/WorkersSystem.js';
import { BuildingSystem } from '../systems/BuildingSystem.js';
import { InventorySystem } from '../systems/InventorySystem.js';
import { CraftingSystem } from '../systems/CraftingSystem.js';
import { ResearchSystem } from '../systems/ResearchSystem.js';
import { SkillSystem } from '../systems/SkillSystem.js';

export class GameState {
    constructor() {
        // Ресурсы
        this.resources = {
            money: 1000,
            oil: 0,
            gasoline: 0,
            food: 100,
            materials: 50,
            science: 0
        };
        
        // Поселение
        this.settlement = {
            population: 10,
            buildings: [],
            comfort: 5,
            happiness: 75
        };
        
        // Системы
        this.workersSystem = new WorkersSystem();
        this.buildingSystem = new BuildingSystem(this.workersSystem);
        this.inventorySystem = new InventorySystem();
        this.craftingSystem = new CraftingSystem(this.inventorySystem);
        this.researchSystem = new ResearchSystem();
        this.skillSystem = new SkillSystem();
        
        this.playerLevel = 1;
        this.experience = 0;
        this.gameTime = 0;
        
        this.initStarterSetup();
    }

    initStarterSetup() {
        // Стартовые рабочие
        this.workersSystem.hireWorker('miner', 'Алексей Шахтов');
        this.workersSystem.hireWorker('farmer', 'Мария Полева');
        this.workersSystem.hireWorker('builder', 'Дмитрий Строев');
        
        // Стартовые здания
        const mine = this.buildingSystem.constructBuilding('mine', {x: 10, y: 10});
        const farm = this.buildingSystem.constructBuilding('farm', {x: 15, y: 10});
        
        // Назначаем рабочих
        const workers = Array.from(this.workersSystem.workers.values());
        if (workers.length >= 2) {
            this.buildingSystem.assignWorkerToBuilding(mine.id, workers[0].id);
            this.buildingSystem.assignWorkerToBuilding(farm.id, workers[1].id);
        }
        
        // Стартовые предметы
        this.inventorySystem.addItem('wood', 20, { category: 'resources' });
        this.inventorySystem.addItem('stone', 15, { category: 'resources' });
        this.inventorySystem.addItem('basic_tools', 1, { 
            category: 'tools', 
            stats: { mining: 1, farming: 1, building: 1 } 
        });
    }

    update(deltaTime) {
        this.gameTime += deltaTime;
        
        // Обновляем рабочих
        this.workersSystem.workers.forEach((worker, workerId) => {
            this.workersSystem.updateWorker(workerId, deltaTime);
        });
        
        // Обновляем крафт
        this.craftingSystem.updateCrafting();
        
        // Обновляем исследования
        this.researchSystem.updateResearch(this);
        
        // Автоматическое производство
        this.updateProduction(deltaTime);
        
        // Выплата зарплаты
        this.paySalaries(deltaTime);
    }

    updateProduction(deltaTime) {
        // Базовая добыча ресурсов от зданий
        this.buildingSystem.buildings.forEach((building, buildingId) => {
            const production = this.buildingSystem.getBuildingProduction(buildingId);
            if (production > 0) {
                // В зависимости от типа здания добавляем ресурсы
                if (building.type === 'mine') {
                    this.resources.materials += production * deltaTime / 3600; // в час
                } else if (building.type === 'farm') {
                    this.resources.food += production * deltaTime / 3600;
                }
            }
        });
    }

    paySalaries(deltaTime) {
        let totalSalary = 0;
        this.workersSystem.workers.forEach(worker => {
            totalSalary += worker.salary * deltaTime / 86400; // Зарплата в день
        });
        
        this.resources.money -= totalSalary;
        this.resources.money = Math.max(0, this.resources.money);
    }

    export() {
        return {
            resources: this.resources,
            settlement: this.settlement,
            playerLevel: this.playerLevel,
            experience: this.experience,
            gameTime: this.gameTime
        };
    }

    import(data) {
        if (data.resources) this.resources = data.resources;
        if (data.settlement) this.settlement = data.settlement;
        if (data.playerLevel) this.playerLevel = data.playerLevel;
        if (data.experience) this.experience = data.experience;
        if (data.gameTime) this.gameTime = data.gameTime;
    }
}
