import { RAW_VOLUME, REFINED_VOLUME } from '../caravans/CaravanConst'
import { EffectPotency } from '../effects/types/EffectPotency'
import { Effects } from '../effects/types/Effects'
import { Icons } from '../icons/Icons'
import { Item, ItemTypes } from '../items/Item'
import { IngredientTypes } from './alchemyTypes'

export const AlchemyItems: Record<string, Item> = {
    GlassFlask: {
        id: 'GlassFlask',
        icon: Icons.RoundPotion,
        nameId: 'GlassFlask',
        value: 10,
        volume: REFINED_VOLUME,
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
        volume: REFINED_VOLUME,
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
        volume: RAW_VOLUME,
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
        volume: RAW_VOLUME,
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
        volume: RAW_VOLUME,
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
        volume: RAW_VOLUME,
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
        volume: RAW_VOLUME,
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
        volume: RAW_VOLUME,
        color: 'text-stamina',
        type: ItemTypes.CraftingIngredient,
        ingredientData: {
            stability: 20,
            type: IngredientTypes.Herb,
            effects: [{ potency: EffectPotency.Low, effect: Effects.Stamina }],
        },
    },

    BitterRoot: {
        id: 'BitterRoot',
        icon: Icons.Leaf,
        nameId: 'BitterRoot',
        value: 4,
        volume: RAW_VOLUME,
        color: 'text-stamina',
        type: ItemTypes.CraftingIngredient,
        ingredientData: {
            stability: 15,
            type: IngredientTypes.Herb,
            effects: [{ potency: EffectPotency.Low, effect: Effects.DamageStamina }],
        },
    },

    Nightshade: {
        id: 'Nightshade',
        icon: Icons.VanillaFlower,
        nameId: 'Nightshade',
        value: 5,
        volume: RAW_VOLUME,
        color: 'text-stamina',
        type: ItemTypes.CraftingIngredient,
        ingredientData: {
            stability: 15,
            type: IngredientTypes.Herb,
            effects: [{ potency: EffectPotency.Low, effect: Effects.DamageStamina }],
        },
    },

    VenomLeaf: {
        id: 'VenomLeaf',
        icon: Icons.Leaf,
        nameId: 'VenomLeaf',
        value: 6,
        volume: RAW_VOLUME,
        color: 'text-health',
        type: ItemTypes.CraftingIngredient,
        ingredientData: {
            stability: 20,
            type: IngredientTypes.Herb,
            effects: [{ potency: EffectPotency.Low, effect: Effects.DamageRegenHealth }],
        },
    },

    ToxicMushroom: {
        id: 'ToxicMushroom',
        icon: Icons.Mushroom,
        nameId: 'ToxicMushroom',
        value: 7,
        volume: RAW_VOLUME,
        color: 'text-health',
        type: ItemTypes.CraftingIngredient,
        ingredientData: {
            stability: 20,
            type: IngredientTypes.Herb,
            effects: [{ potency: EffectPotency.Low, effect: Effects.DamageRegenHealth }],
        },
    },

    VenomGland: {
        id: 'VenomGland',
        icon: Icons.Poison,
        nameId: 'VenomGland',
        value: 8,
        volume: RAW_VOLUME,
        color: 'text-health',
        type: ItemTypes.CraftingIngredient,
        ingredientData: {
            stability: 10,
            type: IngredientTypes.Animal,
            effects: [
                { potency: EffectPotency.Medium, effect: Effects.DamageHealth },
                { potency: EffectPotency.Low, effect: Effects.DamageRegenHealth },
            ],
        },
    },

    SpiderEggSac: {
        id: 'SpiderEggSac',
        icon: Icons.EggClutch,
        nameId: 'SpiderEggSac',
        value: 7,
        volume: RAW_VOLUME,
        color: 'text-stamina',
        type: ItemTypes.CraftingIngredient,
        ingredientData: {
            stability: 10,
            type: IngredientTypes.Animal,
            effects: [
                { potency: EffectPotency.Medium, effect: Effects.DamageStamina },
                { potency: EffectPotency.Low, effect: Effects.DamageRegenStamina },
            ],
        },
    },

    HealingFungus: {
        id: 'HealingFungus',
        icon: Icons.Mushroom,
        nameId: 'HealingFungus',
        value: 6,
        volume: RAW_VOLUME,
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
        volume: RAW_VOLUME,
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
        volume: RAW_VOLUME,
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
        volume: RAW_VOLUME,
        color: 'text-mana',
        type: ItemTypes.CraftingIngredient,
        ingredientData: {
            stability: 5,
            type: IngredientTypes.Mineral,
            effects: [{ potency: EffectPotency.Low, effect: Effects.MaxMana }],
        },
    },
}
