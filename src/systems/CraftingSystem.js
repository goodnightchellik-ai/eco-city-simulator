export class CraftingSystem {
    constructor(inventorySystem) {
        this.inventory = inventorySystem;
        this.recipes = new Map();
        this.workstations = new Set();
        this.craftingQueue = [];
        
        this.initRecipes();
    }

    initRecipes() {
        // Инструменты
        this.addRecipe({
            id: 'wooden_pickaxe',
            name: '⛏️ Деревянная кирка',
            category: 'tools',
            ingredients: [
                { id: 'wood', quantity: 5 },
                { id: 'stone', quantity: 3 }
            ],
            result: { id: 'wooden_pickaxe', quantity: 1 },
            time: 30,
            requiredLevel: 1,
            stats: { mining: 2 }
        });

        this.addRecipe({
            id: 'steel_axe',
            name: '🪓 Стальной топор',
            category: 'tools',
            ingredients: [
                { id: 'wood', quantity: 3 },
                { id: 'steel', quantity: 2 }
            ],
            result: { id: 'steel_axe', quantity: 1 },
            time: 120,
            requiredLevel: 5,
            stats: { farming: 5, attack: 3 }
        });

        // Экипировка для рабочих
        this.addRecipe({
            id: 'work_helmet',
            name: '⛑️ Рабочая каска',
            category: 'equipment',
            ingredients: [
                { id: 'plastic', quantity: 2 },
                { id: 'metal', quantity: 1 }
            ],
            result: { id: 'work_helmet', quantity: 1 },
            time: 60,
            requiredLevel: 2,
            stats: { defense: 2, moraleBonus: 0.05 }
        });
    }

    addRecipe(recipe) {
        this.recipes.set(recipe.id, recipe);
    }

    canCraft(recipeId) {
        const recipe = this.recipes.get(recipeId);
        if (!recipe) return false;

        for (const ingredient of recipe.ingredients) {
            if (!this.inventory.hasItem(ingredient.id, ingredient.quantity)) {
                return false;
            }
        }

        return true;
    }

    startCrafting(recipeId) {
        if (!this.canCraft(recipeId)) return false;

        const recipe = this.recipes.get(recipeId);
        
        recipe.ingredients.forEach(ing => {
            this.inventory.removeItem(ing.id, ing.quantity);
        });

        this.craftingQueue.push({
            recipeId,
            startTime: Date.now(),
            endTime: Date.now() + (recipe.time * 1000),
            progress: 0
        });

        return true;
    }

    updateCrafting() {
        const now = Date.now();
        this.craftingQueue = this.craftingQueue.filter(job => {
            job.progress = (now - job.startTime) / (job.endTime - job.startTime);
            
            if (now >= job.endTime) {
                const recipe = this.recipes.get(job.recipeId);
                this.inventory.addItem(recipe.result.id, recipe.result.quantity, {
                    category: recipe.category,
                    stats: recipe.stats,
                    rarity: recipe.rarity
                });
                return false;
            }
            return true;
        });
    }

    getCraftingProgress() {
        return this.craftingQueue.map(job => {
            const recipe = this.recipes.get(job.recipeId);
            return {
                recipe: recipe,
                progress: job.progress,
                timeLeft: Math.max(0, job.endTime - Date.now())
            };
        });
    }

    getAvailableRecipes() {
        return Array.from(this.recipes.values());
    }
}
