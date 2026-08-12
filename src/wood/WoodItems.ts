import { RAW_VOLUME, REFINED_VOLUME } from '../caravans/CaravanConst'
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
        volume: RAW_VOLUME,
    },
    OakLog: {
        id: 'OakLog',
        icon: Icons.Log,
        nameId: 'Log',
        materials: { [PRIMARY_MATERIAL_KEY]: Materials.Oak },
        type: ItemTypes.Log,
        value: 6,
        volume: RAW_VOLUME,
    },

    // plank
    DeadTreePlank: {
        id: 'DeadTreePlank',
        icon: Icons.Plank,
        nameId: 'Plank',
        materials: { [PRIMARY_MATERIAL_KEY]: Materials.DeadWood },
        type: ItemTypes.Plank,
        value: 10,
        volume: REFINED_VOLUME,
    },
    OakPlank: {
        id: 'OakPlank',
        icon: Icons.Plank,
        nameId: 'Plank',
        materials: { [PRIMARY_MATERIAL_KEY]: Materials.Oak },
        type: ItemTypes.Plank,
        value: 12,
        volume: REFINED_VOLUME,
    },

    //  handle
    DeadTreeHandle: {
        id: 'DeadTreeHandle',
        icon: Icons.Handle,
        nameId: 'Handle',
        materials: { [PRIMARY_MATERIAL_KEY]: Materials.DeadWood },
        type: ItemTypes.Handle,
        value: 15,
        volume: REFINED_VOLUME,
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
        volume: REFINED_VOLUME,
        craftingData: {
            prestige: 1,
            speedBonus: 1.1,
        },
    },
} satisfies Record<string, Item>
