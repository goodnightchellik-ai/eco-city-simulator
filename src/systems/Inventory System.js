export class InventorySystem {
    constructor() {
        this.items = new Map();
        this.equipment = new Map();
        this.maxSlots = 50;
        this.categories = {
            weapons: '⚔️ Оружие',
            tools: '🛠️ Инструменты', 
            resources: '📦 Ресурсы',
            consumables: '🧪 Расходники',
            artifacts: '💎 Артефакты'
        };
    }

    addItem(itemId, quantity = 1, metadata = {}) {
        const existing = this.items.get(itemId);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this.items.set(itemId, {
                id: itemId,
                quantity,
                metadata,
                category: metadata.category || 'resources',
                rarity: metadata.rarity || 'common'
            });
        }
        this.onInventoryUpdate();
    }

    removeItem(itemId, quantity = 1) {
        const existing = this.items.get(itemId);
        if (!existing) return false;

        if (existing.quantity <= quantity) {
            this.items.delete(itemId);
        } else {
            existing.quantity -= quantity;
        }
        
        this.onInventoryUpdate();
        return true;
    }

    hasItem(itemId, quantity = 1) {
        const item = this.items.get(itemId);
        return item && item.quantity >= quantity;
    }

    equipItem(itemId, slot) {
        const item = this.items.get(itemId);
        if (!item) return false;

        if (this.canEquipInSlot(item, slot)) {
            this.equipment.set(slot, item);
            this.removeItem(itemId, 1);
            this.onEquipmentUpdate();
            return true;
        }
        return false;
    }

    canEquipInSlot(item, slot) {
        const slotCategories = {
            head: ['helmet', 'hat'],
            body: ['armor', 'clothing'],
            hands: ['gloves', 'tools'],
            feet: ['boots', 'shoes'],
            tool: ['weapon', 'tool'],
            accessory: ['ring', 'amulet', 'consumable']
        };

        return slotCategories[slot]?.includes(item.metadata?.equipType);
    }

    getEquipmentStats() {
        const stats = {
            attack: 0, defense: 0, mining: 0, farming: 0,
            building: 0, research: 0, luck: 0
        };

        for (const [slot, item] of this.equipment) {
            if (item.metadata.stats) {
                Object.keys(item.metadata.stats).forEach(stat => {
                    stats[stat] += item.metadata.stats[stat];
                });
            }
        }

        return stats;
    }

    getInventoryCount() {
        let total = 0;
        for (const item of this.items.values()) {
            total += item.quantity;
        }
        return total;
    }

    onInventoryUpdate() {
        // Событие обновления инвентаря
        if (window.game && window.game.gameState) {
            window.game.gameState.triggerEvent('inventoryUpdate');
        }
    }

    onEquipmentUpdate() {
        // Событие обновления экипировки
        if (window.game && window.game.gameState) {
            window.game.gameState.triggerEvent('equipmentUpdate');
        }
    }
}
