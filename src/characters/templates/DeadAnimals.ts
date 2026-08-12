import { RecipeItem } from '../../crafting/RecipeInterfaces'
import { Icons } from '../../icons/Icons'
import { Item, ItemTypes } from '../../items/Item'

export type Butchering = { stdItem: string; qta: number }[]

export const DeadAnimals: Record<string, Item & { butchering?: RecipeItem[] }> = {
    DeadChicken: {
        id: 'DeadChicken',
        icon: Icons.Chicken,
        nameId: 'DeadChicken',
        type: ItemTypes.Corpse,
        value: 5,
        volume: 0.01,
        butchering: [
            {
                id: 'WhiteMeat',
                stdItemId: 'WhiteMeat',
                qta: 1,
            },
        ],
    },
    DeadBoar: {
        id: 'DeadBoar',
        icon: Icons.Boar,
        nameId: 'DeadBoar',
        type: ItemTypes.Corpse,
        value: 5,
        volume: 0.15,
        butchering: [
            {
                id: 'RedMeat',
                stdItemId: 'RedMeat',
                qta: 2,
            },
        ],
    },
    DeadWolf: {
        id: 'DeadWolf',
        icon: Icons.WolfHead,
        nameId: 'DeadWolf',
        type: ItemTypes.Corpse,
        value: 8,
        volume: 0.08,
        butchering: [
            {
                id: 'RedMeat',
                stdItemId: 'RedMeat',
                qta: 2,
            },
        ],
    },
}
