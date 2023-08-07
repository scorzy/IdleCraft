import { Item, ItemTypes } from '../items/Item'
import { Icons } from '../icons/Icons'

export const WoodItems = {
    DeadTreeLog: {
        id: 'DeadTreeLog',
        icon: Icons.Log,
        nameId: 'DeadTreeLog',
        type: ItemTypes.Log,
    },
    OakLog: {
        id: 'OakLog',
        icon: Icons.Log,
        nameId: 'OakLog',
        type: ItemTypes.Log,
    },
    DeadTreePlank: {
        id: 'DeadTreePlank',
        icon: Icons.Log,
        nameId: 'DeadTreePlank',
        type: ItemTypes.Plank,
    },
    OakPlank: {
        id: 'OakPlank',
        icon: Icons.Log,
        nameId: 'OakPlank',
        type: ItemTypes.Plank,
    },
} satisfies { [k: string]: Item }
