export class BuildingSystem {
    constructor(workersSystem) {
        this.workersSystem = workersSystem;
        this.buildings = new Map();
        this.buildingTemplates = {
            mine: {
                name: '⛏️ Шахта',
                workerSlots: 3,
                allowedProfessions: ['miner'],
                baseProduction: 10,
                workerEfficiency: 0.3
            },
            farm: {
                name: '🌾 Ферма', 
                workerSlots: 2,
                allowedProfessions: ['farmer'],
                baseProduction: 8,
                workerEfficiency: 0.4
            },
            factory: {
                name: '🏭 Фабрика',
                workerSlots: 4,
                allowedProfessions: ['engineer', 'miner'],
                baseProduction: 15,
                workerEfficiency: 0.25
            },
            research_lab: {
                name: '🔬 Лаборатория',
                workerSlots: 2,
                allowedProfessions: ['scientist'],
                baseProduction: 5,
                workerEfficiency: 0.5
            }
        };
    }

    constructBuilding(type, position) {
        const template = this.buildingTemplates[type];
        if (!template) return null;

        const buildingId = `building_${Date.now()}`;
        
        const building = {
            id: buildingId,
            type: type,
            name: template.name,
            position: position,
            level: 1,
            workerSlots: template.workerSlots,
            assignedWorkers: [],
            production: template.baseProduction,
            efficiency: 1.0,
            maintenanceCost: template.baseProduction * 2
        };

        this.buildings.set(buildingId, building);
        return building;
    }

    assignWorkerToBuilding(buildingId, workerId) {
        const building = this.buildings.get(buildingId);
        const worker = this.workersSystem.workers.get(workerId);
        
        if (!building || !worker) return false;

        if (building.assignedWorkers.length >= building.workerSlots) {
            return false;
        }

        const template = this.buildingTemplates[building.type];
        if (!template.allowedProfessions.includes(worker.profession)) {
            return false;
        }

        building.assignedWorkers.push(workerId);
        this.workersSystem.assignWorker(workerId, buildingId);
        
        this.updateBuildingEfficiency(buildingId);
        
        return true;
    }

    unassignWorkerFromBuilding(buildingId, workerId) {
        const building = this.buildings.get(buildingId);
        if (!building) return false;

        const workerIndex = building.assignedWorkers.indexOf(workerId);
        if (workerIndex === -1) return false;

        building.assignedWorkers.splice(workerIndex, 1);
        this.workersSystem.unassignWorker(workerId);
        
        this.updateBuildingEfficiency(buildingId);
        return true;
    }

    updateBuildingEfficiency(buildingId) {
        const building = this.buildings.get(buildingId);
        if (!building) return;

        const template = this.buildingTemplates[building.type];
        let totalEfficiency = 1.0;

        building.assignedWorkers.forEach(workerId => {
            const worker = this.workersSystem.workers.get(workerId);
            if (worker) {
                totalEfficiency += template.workerEfficiency * worker.efficiency;
            }
        });

        building.efficiency = totalEfficiency;
        building.currentProduction = template.baseProduction * building.efficiency;
    }

    getBuildingProduction(buildingId) {
        const building = this.buildings.get(buildingId);
        if (!building) return 0;

        return building.currentProduction || 0;
    }

    upgradeBuilding(buildingId) {
        const building = this.buildings.get(buildingId);
        if (!building) return false;

        building.level++;
        building.workerSlots += 1;
        building.production = this.buildingTemplates[building.type].baseProduction * building.level;
        
        this.updateBuildingEfficiency(buildingId);
        return true;
    }
}
