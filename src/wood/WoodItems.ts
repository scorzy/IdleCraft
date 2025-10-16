import { Item, ItemTypes } from '../items/Item'
import { Icons } from '../icons/Icons'
import { Materials } from '../items/materials/materials'
import { PRIMARY_MATERIAL_KEY } from '../items/itemsConst'

export const WoodItems = {
    DeadTreeLog: {
        id: 'DeadTreeLog',
        icon: Icons.Log,
        nameId: 'Log',
        materials: { [PRIMARY_MATERIAL_KEY]: Materials.DeadWood },
        type: ItemTypes.Log,
        value: 5,
    },
    OakLog: {
        id: 'OakLog',
        icon: Icons.Log,
        nameId: 'Log',
        materials: { [PRIMARY_MATERIAL_KEY]: Materials.Oak },
        type: ItemTypes.Log,
        value: 6,
    },

    // plank
    DeadTreePlank: {
        id: 'DeadTreePlank',
        icon: Icons.Plank,
        nameId: 'Plank',
        materials: { [PRIMARY_MATERIAL_KEY]: Materials.DeadWood },
        type: ItemTypes.Plank,
        value: 10,
    },
    OakPlank: {
        id: 'OakPlank',
        icon: Icons.Plank,
        nameId: 'Plank',
        materials: { [PRIMARY_MATERIAL_KEY]: Materials.Oak },
        type: ItemTypes.Plank,
        value: 12,
    },

    //  handle
    DeadTreeHandle: {
        id: 'DeadTreeHandle',
        icon: Icons.Handle,
        nameId: 'Handle',
        materials: { [PRIMARY_MATERIAL_KEY]: Materials.DeadWood },
        type: ItemTypes.Handle,
        value: 15,
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
        craftingData: {
            prestige: 1,
            speedBonus: 1.1,
        },
    },
} satisfies Record<string, Item>
