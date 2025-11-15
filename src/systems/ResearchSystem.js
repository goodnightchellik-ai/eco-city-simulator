export class ResearchSystem {
    constructor() {
        this.availableResearch = new Map();
        this.completedResearch = new Set();
        this.currentResearch = null;
        this.researchProgress = 0;
        
        this.initResearchTree();
    }

    initResearchTree() {
        this.addResearch({
            id: 'basic_engineering',
            name: '🔧 Основы инженерии',
            description: 'Открывает базовые инструменты и постройки',
            cost: { science: 100, money: 500 },
            time: 300,
            requirements: [],
            unlocks: ['wooden_tools', 'basic_buildings']
        });

        this.addResearch({
            id: 'advanced_agriculture', 
            name: '🌾 Продвинутое сельское хозяйство',
            description: '+30% к урожайности, открывает новые культуры',
            cost: { science: 300, money: 1000 },
            time: 600,
            requirements: ['basic_engineering'],
            unlocks: ['irrigation_system', 'greenhouses'],
            effects: { farmingYield: 0.3 }
        });

        this.addResearch({
            id: 'renewable_energy',
            name: '⚡ Возобновляемая энергия', 
            description: 'Открывает солнечные панели и ветряки',
            cost: { science: 500, money: 2000 },
            time: 900,
            requirements: ['basic_engineering'],
            unlocks: ['solar_panels', 'wind_turbines'],
            effects: { energyProduction: 50, pollutionReduction: 0.2 }
        });
    }

    addResearch(research) {
        this.availableResearch.set(research.id, research);
    }

    canResearch(researchId) {
        const research = this.availableResearch.get(researchId);
        if (!research) return false;

        if (this.completedResearch.has(researchId)) return false;

        for (const req of research.requirements) {
            if (!this.completedResearch.has(req)) return false;
        }

        return true;
    }

    startResearch(researchId) {
        if (this.currentResearch || this.completedResearch.has(researchId)) {
            return false;
        }

        const research = this.availableResearch.get(researchId);
        if (!research || !this.canResearch(researchId)) return false;

        this.currentResearch = {
            id: researchId,
            startTime: Date.now(),
            endTime: Date.now() + (research.time * 1000),
            progress: 0
        };

        return true;
    }

    updateResearch(gameState) {
        if (!this.currentResearch) return;

        const now = Date.now();
        const research = this.availableResearch.get(this.currentResearch.id);
        
        this.currentResearch.progress = (now - this.currentResearch.startTime) / 
                                      (this.currentResearch.endTime - this.currentResearch.startTime);

        if (now >= this.currentResearch.endTime) {
            this.completeResearch(this.currentResearch.id);
        }
    }

    completeResearch(researchId) {
        this.completedResearch.add(researchId);
        const research = this.availableResearch.get(researchId);
        
        if (research.effects) {
            this.applyResearchEffects(research.effects);
        }

        this.currentResearch = null;
        this.researchProgress = 0;
        
        console.log(`🎓 Исследование завершено: ${research.name}`);
    }

    applyResearchEffects(effects) {
        // Применяем эффекты исследований к игровому состоянию
        Object.keys(effects).forEach(effect => {
            console.log(`🔧 Применен эффект исследования: ${effect} = ${effects[effect]}`);
        });
    }

    getAvailableResearch() {
        return Array.from(this.availableResearch.values()).filter(research => 
            this.canResearch(research.id)
        );
    }

    getResearchProgress() {
        if (!this.currentResearch) return null;
        
        const research = this.availableResearch.get(this.currentResearch.id);
        return {
            research: research,
            progress: this.currentResearch.progress,
            timeLeft: Math.max(0, this.currentResearch.endTime - Date.now())
        };
    }
}
