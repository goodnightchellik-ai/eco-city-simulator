export class SkillSystem {
    constructor() {
        this.skills = {
            mining: { level: 1, exp: 0, expToNext: 100 },
            farming: { level: 1, exp: 0, expToNext: 100 },
            building: { level: 1, exp: 0, expToNext: 100 },
            crafting: { level: 1, exp: 0, expToNext: 100 },
            research: { level: 1, exp: 0, expToNext: 100 },
            leadership: { level: 1, exp: 0, expToNext: 100 }
        };

        this.skillBonuses = {
            mining: {
                1: { miningSpeed: 0.1 },
                5: { miningYield: 0.2 },
                10: { unlock: 'advanced_mining' }
            },
            farming: {
                1: { growthSpeed: 0.1 },
                5: { yield: 0.25 },
                10: { unlock: 'organic_farming' }
            },
            building: {
                1: { buildSpeed: 0.1 },
                5: { costReduction: 0.15 },
                10: { unlock: 'advanced_construction' }
            },
            crafting: {
                1: { craftSpeed: 0.1 },
                5: { quality: 0.2 },
                10: { unlock: 'master_crafting' }
            },
            research: {
                1: { researchSpeed: 0.1 },
                5: { efficiency: 0.25 },
                10: { unlock: 'breakthrough_research' }
            },
            leadership: {
                1: { workerEfficiency: 0.05 },
                5: { maxWorkers: 5 },
                10: { unlock: 'advanced_management' }
            }
        };
    }

    addExp(skill, exp) {
        if (!this.skills[skill]) return;

        this.skills[skill].exp += exp;
        
        while (this.skills[skill].exp >= this.skills[skill].expToNext) {
            this.levelUp(skill);
        }
    }

    levelUp(skill) {
        this.skills[skill].level++;
        this.skills[skill].exp -= this.skills[skill].expToNext;
        this.skills[skill].expToNext = Math.floor(this.skills[skill].expToNext * 1.5);

        this.applyLevelBonuses(skill, this.skills[skill].level);
        
        console.log(`🎯 ${skill} повышен до уровня ${this.skills[skill].level}!`);
    }

    getSkillBonus(skill) {
        const level = this.skills[skill].level;
        const bonuses = this.skillBonuses[skill];
        if (!bonuses) return {};

        let result = {};
        for (const [lvl, bonus] of Object.entries(bonuses)) {
            if (level >= parseInt(lvl)) {
                Object.assign(result, bonus);
            }
        }

        return result;
    }

    getAllBonuses() {
        const bonuses = {};
        Object.keys(this.skills).forEach(skill => {
            Object.assign(bonuses, this.getSkillBonus(skill));
        });
        return bonuses;
    }

    applyLevelBonuses(skill, level) {
        const bonuses = this.skillBonuses[skill];
        if (bonuses && bonuses[level]) {
            console.log(`✨ Получен бонус за уровень ${level} в ${skill}:`, bonuses[level]);
        }
    }

    getTotalLevel() {
        return Object.values(this.skills).reduce((total, skill) => total + skill.level, 0);
    }

    getSkillProgress(skill) {
        const skillData = this.skills[skill];
        if (!skillData) return 0;
        return (skillData.exp / skillData.expToNext) * 100;
    }
}
