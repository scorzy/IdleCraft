import { RecipeItem } from '../../crafting/RecipeInterfaces'
import { Icons } from '../../icons/Icons'
import { Item, ItemTypes } from '../../items/Item'

export type Butchering = { stdItem: string; qta: number }[]

export const DeadAnimals: Record<string, Item & { butchering?: RecipeItem[] }> = {
    DeadBoar: {
        id: 'DeadBoar',
        icon: Icons.Boar,
        nameId: 'DeadBoar',
        type: ItemTypes.Corpse,
        value: 5,
        butchering: [
            {
                id: '',
                stdItemId: '',
                qta: 1,
            },
        ],
    },
}
