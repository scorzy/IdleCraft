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
        value: 1,
        type: ItemTypes.Flask,
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
                { potency: EffectPotency.Low, effect: Effects.Health },
                { potency: EffectPotency.Low, effect: Effects.RegenHealth },
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
                { potency: EffectPotency.Low, effect: Effects.Health },
                { potency: EffectPotency.Low, effect: Effects.RegenHealth },
            ],
        },
    },
}
