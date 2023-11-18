import { Item, ItemTypes } from '../items/Item'
import { Icons } from '../icons/Icons'
import { WoodData } from './WoodData'
import { WoodTypes } from './WoodTypes'

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

    // plank
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

    //  handle
    DeadTreeHandle: {
        id: 'DeadTreeHandle',
        icon: Icons.Handle,
        nameId: 'DeadTreeHandle',
        type: ItemTypes.Handle,
        value: 15,
        handleData: WoodData[WoodTypes.DeadTree].handleData,
    },
    OakHandle: {
        id: 'OakHandle',
        icon: Icons.Handle,
        nameId: 'OakHandle',
        type: ItemTypes.Handle,
        value: 20,
        handleData: WoodData[WoodTypes.Oak].handleData,
    },
} satisfies Record<string, Item>
