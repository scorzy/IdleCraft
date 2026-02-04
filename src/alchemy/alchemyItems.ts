import { Icons } from '../icons/Icons'
import { Item, ItemTypes } from '../items/Item'
import { EffectPotency } from '../effects/types/EffectPotency'
import { Effects } from '../effects/types/Effects'
import { IngredientTypes } from './alchemyTypes'

export const AlchemyItems: Record<string, Item> = {
    GlassFlask: {
        id: 'GlassFlask',
        icon: Icons.RoundPotion,
        nameId: 'GlassFlask',
        value: 10,
        type: ItemTypes.Flask,
        flaskData: {
            reusePercent: 0,
        },
    },
    Water: {
        id: 'Water',
        icon: Icons.RoundPotion,
        nameId: 'Water',
        color: 'text-mana',
        value: 1,
        type: ItemTypes.Solvent,
        unlimited: true,
        solventData: {
            potency: EffectPotency.Low,
        },
    },
    RedFlower: {
        id: 'RedFlower',
        icon: Icons.VanillaFlower,
        nameId: 'RedFlower',
        value: 3,
        color: 'text-health',
        type: ItemTypes.CraftingIngredient,
        ingredientData: {
            stability: 10,
            type: IngredientTypes.Herb,
            effects: [
                { potency: EffectPotency.Low, effect: Effects.Health },
                { potency: EffectPotency.Low, effect: Effects.RegenHealth },
            ],
        },
    },
    BlueFlower: {
        id: 'BlueFlower',
        icon: Icons.VanillaFlower,
        nameId: 'BlueFlower',
        value: 3,
        color: 'text-mana',
        type: ItemTypes.CraftingIngredient,
        ingredientData: {
            stability: 10,
            type: IngredientTypes.Herb,
            effects: [
                { potency: EffectPotency.Low, effect: Effects.Mana },
                { potency: EffectPotency.Low, effect: Effects.RegenMana },
            ],
        },
    },
    GreenFlower: {
        id: 'GreenFlower',
        icon: Icons.VanillaFlower,
        nameId: 'GreenFlower',
        value: 3,
        color: 'text-stamina',
        type: ItemTypes.CraftingIngredient,
        ingredientData: {
            stability: 10,
            type: IngredientTypes.Herb,
            effects: [
                { potency: EffectPotency.Low, effect: Effects.Stamina },
                { potency: EffectPotency.Low, effect: Effects.RegenStamina },
            ],
        },
    },

    VitalHerb: {
        id: 'VitalHerb',
        icon: Icons.Leaf,
        nameId: 'VitalHerb',
        value: 4,
        color: 'text-health',
        type: ItemTypes.CraftingIngredient,
        ingredientData: {
            stability: 20,
            type: IngredientTypes.Herb,
            effects: [{ potency: EffectPotency.Low, effect: Effects.Health }],
        },
    },

    ManaBloom: {
        id: 'ManaBloom',
        icon: Icons.VanillaFlower,
        nameId: 'ManaBloom',
        value: 4,
        color: 'text-mana',
        type: ItemTypes.CraftingIngredient,
        ingredientData: {
            stability: 20,
            type: IngredientTypes.Herb,
            effects: [{ potency: EffectPotency.Low, effect: Effects.Mana }],
        },
    },

    StaminaLeaf: {
        id: 'StaminaLeaf',
        icon: Icons.Leaf,
        nameId: 'StaminaLeaf',
        value: 4,
        color: 'text-stamina',
        type: ItemTypes.CraftingIngredient,
        ingredientData: {
            stability: 20,
            type: IngredientTypes.Herb,
            effects: [{ potency: EffectPotency.Low, effect: Effects.Stamina }],
        },
    },

    HealingFungus: {
        id: 'HealingFungus',
        icon: Icons.Mushroom,
        nameId: 'HealingFungus',
        value: 6,
        color: 'text-health',
        type: ItemTypes.CraftingIngredient,
        ingredientData: {
            stability: 0,
            type: IngredientTypes.Herb,
            effects: [{ potency: EffectPotency.Low, effect: Effects.RegenHealth }],
        },
    },

    ManaSpore: {
        id: 'ManaSpore',
        icon: Icons.Mushroom,
        nameId: 'ManaSpore',
        value: 6,
        color: 'text-mana',
        type: ItemTypes.CraftingIngredient,
        ingredientData: {
            stability: 0,
            type: IngredientTypes.Herb,
            effects: [{ potency: EffectPotency.Low, effect: Effects.RegenMana }],
        },
    },

    HeartCrystalDust: {
        id: 'HeartCrystalDust',
        icon: Icons.SwapBag,
        nameId: 'HeartCrystalDust',
        value: 10,
        color: 'text-health',
        type: ItemTypes.CraftingIngredient,
        ingredientData: {
            stability: 5,
            type: IngredientTypes.Mineral,
            effects: [{ potency: EffectPotency.Low, effect: Effects.MaxHealth }],
        },
    },

    ManaCrystalDust: {
        id: 'ManaCrystalDust',
        icon: Icons.SwapBag,
        nameId: 'ManaCrystalDust',
        value: 10,
        color: 'text-mana',
        type: ItemTypes.CraftingIngredient,
        ingredientData: {
            stability: 5,
            type: IngredientTypes.Mineral,
            effects: [{ potency: EffectPotency.Low, effect: Effects.MaxMana }],
        },
    },
}
