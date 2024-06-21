import { Icons } from '../../icons/Icons'
import { Item, ItemTypes } from '../../items/Item'

export type Butchering = { stdItem: string; quantity: number }[]

export const DeadAnimals: Record<string, Item & { butchering: Butchering }> = {
    DeadBoar: {
        id: 'DeadBoar',
        icon: Icons.Boar,
        nameId: 'DeadBoar',
        type: ItemTypes.Corpse,
        value: 5,
        butchering: [
            {
                stdItem: '',
                quantity: 1,
            },
        ],
    },
}
