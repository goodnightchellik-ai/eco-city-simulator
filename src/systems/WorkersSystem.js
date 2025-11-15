export class WorkersSystem {
    constructor() {
        this.workers = new Map();
        this.professions = {
            miner: { name: '⛏️ Шахтер', baseSalary: 50, skills: ['mining', 'strength'] },
            farmer: { name: '🌾 Фермер', baseSalary: 40, skills: ['farming', 'harvesting'] },
            builder: { name: '🏗️ Строитель', baseSalary: 60, skills: ['building', 'construction'] },
            engineer: { name: '⚙️ Инженер', baseSalary: 80, skills: ['engineering', 'maintenance'] },
            driver: { name: '🚚 Водитель', baseSalary: 45, skills: ['driving', 'logistics'] },
            scientist: { name: '🔬 Ученый', baseSalary: 90, skills: ['research', 'analysis'] },
            manager: { name: '👔 Менеджер', baseSalary: 70, skills: ['management', 'efficiency'] }
        };
        
        this.workerEquipmentSlots = {
            head: '👒 Голова',
            body: '👕 Тело', 
            hands: '🧤 Руки',
            feet: '👢 Обувь',
            tool: '🛠️ Инструмент',
            accessory: '💍 Аксессуар'
        };
    }

    hireWorker(professionType, name = null) {
        const profession = this.professions[professionType];
        if (!profession) return null;

        const workerId = `worker_${Date.now()}`;
        const workerName = name || this.generateWorkerName();
        
        const worker = {
            id: workerId,
            name: workerName,
            profession: professionType,
            level: 1,
            experience: 0,
            energy: 100,
            morale: 100,
            salary: profession.baseSalary,
            skills: this.generateWorkerSkills(profession.skills),
            equipment: new Map(),
            assignedBuilding: null,
            efficiency: 1.0,
            traits: this.generateTraits()
        };

        this.workers.set(workerId, worker);
        return worker;
    }

    generateWorkerSkills(primarySkills) {
        const skills = {};
        
        primarySkills.forEach(skill => {
            skills[skill] = {
                level: Math.floor(Math.random() * 3) + 1,
                experience: 0
            };
        });

        const allSkills = ['strength', 'endurance', 'intelligence', 'dexterity', 'charisma'];
        const secondarySkills = allSkills.filter(s => !primarySkills.includes(s));
        
        secondarySkills.slice(0, 2).forEach(skill => {
            skills[skill] = {
                level: Math.floor(Math.random() * 2) + 1,
                experience: 0
            };
        });

        return skills;
    }

    generateTraits() {
        const traits = [
            'hardworking', 'lazy', 'creative', 'careful', 'clumsy', 
            'energetic', 'tired', 'loyal', 'ambitious', 'teamplayer'
        ];
        
        return [traits[Math.floor(Math.random() * traits.length)]];
    }

    assignWorker(workerId, buildingId) {
        const worker = this.workers.get(workerId);
        if (!worker) return false;

        if (worker.assignedBuilding) {
            this.unassignWorker(workerId);
        }

        worker.assignedBuilding = buildingId;
        worker.efficiency = this.calculateEfficiency(worker);
        
        return true;
    }

    unassignWorker(workerId) {
        const worker = this.workers.get(workerId);
        if (!worker) return false;

        worker.assignedBuilding = null;
        worker.efficiency = 1.0;
        
        return true;
    }

    equipItem(workerId, item, slot) {
        const worker = this.workers.get(workerId);
        if (!worker) return false;

        if (!this.workerEquipmentSlots[slot]) return false;

        worker.equipment.set(slot, item);
        worker.efficiency = this.calculateEfficiency(worker);
        
        return true;
    }

    unequipItem(workerId, slot) {
        const worker = this.workers.get(workerId);
        if (!worker) return false;

        worker.equipment.delete(slot);
        worker.efficiency = this.calculateEfficiency(worker);
        
        return true;
    }

    calculateEfficiency(worker) {
        let efficiency = 1.0;

        efficiency *= (1 + (worker.level - 1) * 0.1);

        for (const [slot, item] of worker.equipment) {
            if (item.metadata?.efficiencyBonus) {
                efficiency += item.metadata.efficiencyBonus;
            }
        }

        if (worker.traits.includes('hardworking')) efficiency *= 1.15;
        if (worker.traits.includes('lazy')) efficiency *= 0.85;
        if (worker.traits.includes('energetic')) efficiency *= 1.1;

        efficiency *= (worker.morale / 100);

        return Math.min(efficiency, 2.0);
    }

    updateWorker(workerId, deltaTime) {
        const worker = this.workers.get(workerId);
        if (!worker) return;

        if (worker.assignedBuilding) {
            worker.energy -= 0.1 * deltaTime;
            worker.experience += 0.5 * deltaTime;
            
            if (worker.experience >= this.getExpForNextLevel(worker.level)) {
                this.levelUpWorker(workerId);
            }
        } else {
            worker.energy = Math.min(worker.energy + 0.2 * deltaTime, 100);
        }

        this.updateMorale(worker, deltaTime);
    }

    levelUpWorker(workerId) {
        const worker = this.workers.get(workerId);
        if (!worker) return;

        worker.level++;
        worker.experience = 0;
        worker.salary = Math.floor(worker.salary * 1.2);
        
        const skillKeys = Object.keys(worker.skills);
        const randomSkill = skillKeys[Math.floor(Math.random() * skillKeys.length)];
        worker.skills[randomSkill].level++;

        console.log(`🎉 ${worker.name} повысил уровень до ${worker.level}!`);
    }

    getExpForNextLevel(level) {
        return level * 100;
    }

    updateMorale(worker, deltaTime) {
        worker.morale -= 0.01 * deltaTime;

        for (const [slot, item] of worker.equipment) {
            if (item.metadata?.moraleBonus) {
                worker.morale += item.metadata.moraleBonus * deltaTime;
            }
        }

        if (worker.traits.includes('happy')) worker.morale += 0.02 * deltaTime;

        worker.morale = Math.max(0, Math.min(100, worker.morale));
    }

    generateWorkerName() {
        const names = ['Алексей', 'Мария', 'Дмитрий', 'Елена', 'Сергей', 'Ольга', 'Иван', 'Анна'];
        const surnames = ['Иванов', 'Петров', 'Сидоров', 'Кузнецов', 'Попов', 'Васильев', 'Смирнов', 'Новиков'];
        return `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
    }

    getWorkersByProfession(professionType) {
        return Array.from(this.workers.values()).filter(worker => 
            worker.profession === professionType
        );
    }

    getAvailableWorkers() {
        return Array.from(this.workers.values()).filter(worker => 
            !worker.assignedBuilding
        );
    }

    fireWorker(workerId) {
        const worker = this.workers.get(workerId);
        if (!worker) return false;

        worker.equipment.forEach((item, slot) => {
            this.unequipItem(workerId, slot);
        });

        this.workers.delete(workerId);
        return true;
    }
          }
