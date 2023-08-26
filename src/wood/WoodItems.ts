import { Item, ItemTypes } from '../items/Item'
import { Icons } from '../icons/Icons'

export const WoodItems = {
    DeadTreeLog: {
        id: 'DeadTreeLog',
        icon: Icons.Log,
        nameId: 'DeadTreeLog',
        type: ItemTypes.Log,
        value: 5,
    },
    OakLog: {
        id: 'OakLog',
        icon: Icons.Log,
        nameId: 'OakLog',
        type: ItemTypes.Log,
        value: 6,
    },
    DeadTreePlank: {
        id: 'DeadTreePlank',
        icon: Icons.Plank,
        nameId: 'DeadTreePlank',
        type: ItemTypes.Plank,
        value: 10,
    },
    OakPlank: {
        id: 'OakPlank',
        icon: Icons.Plank,
        nameId: 'OakPlank',
        type: ItemTypes.Plank,
        value: 12,
    },
} satisfies { [k: string]: Item }
