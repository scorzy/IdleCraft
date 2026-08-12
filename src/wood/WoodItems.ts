import { Icons } from '../icons/Icons'
import { Item, ItemTypes } from '../items/Item'
import { PRIMARY_MATERIAL_KEY } from '../items/itemsConst'
import { Materials } from '../items/materials/materials'

export const WoodItems = {
    DeadTreeLog: {
        id: 'DeadTreeLog',
        icon: Icons.Log,
        nameId: 'Log',
        materials: { [PRIMARY_MATERIAL_KEY]: Materials.DeadWood },
        type: ItemTypes.Log,
        value: 5,
        volume: 0.05,
    },
    OakLog: {
        id: 'OakLog',
        icon: Icons.Log,
        nameId: 'Log',
        materials: { [PRIMARY_MATERIAL_KEY]: Materials.Oak },
        type: ItemTypes.Log,
        value: 6,
        volume: 0.05,
    },

    // plank
    DeadTreePlank: {
        id: 'DeadTreePlank',
        icon: Icons.Plank,
        nameId: 'Plank',
        materials: { [PRIMARY_MATERIAL_KEY]: Materials.DeadWood },
        type: ItemTypes.Plank,
        value: 10,
        volume: 0.02,
    },
    OakPlank: {
        id: 'OakPlank',
        icon: Icons.Plank,
        nameId: 'Plank',
        materials: { [PRIMARY_MATERIAL_KEY]: Materials.Oak },
        type: ItemTypes.Plank,
        value: 12,
        volume: 0.02,
    },

    //  handle
    DeadTreeHandle: {
        id: 'DeadTreeHandle',
        icon: Icons.Handle,
        nameId: 'Handle',
        materials: { [PRIMARY_MATERIAL_KEY]: Materials.DeadWood },
        type: ItemTypes.Handle,
        value: 15,
        volume: 0.0005,
        craftingData: {
            prestige: 1,
            speedBonus: 1,
        },
    },
    OakHandle: {
        id: 'OakHandle',
        icon: Icons.Handle,
        nameId: 'Handle',
        materials: { [PRIMARY_MATERIAL_KEY]: Materials.Oak },
        type: ItemTypes.Handle,
        value: 20,
        volume: 0.0005,
        craftingData: {
            prestige: 1,
            speedBonus: 1.1,
        },
    },
} satisfies Record<string, Item>
