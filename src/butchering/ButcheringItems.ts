import { RAW_VOLUME } from '../caravans/CaravanConst'
import { Icons } from '../icons/Icons'
import { Item, ItemTypes } from '../items/Item'

export const ButcheringItems: Record<string, Item> = {
    WhiteMeat: {
        id: 'WhiteMeat',
        icon: Icons.Steak,
        nameId: 'WhiteMeat',
        type: ItemTypes.RawFood,
        value: 5,
        volume: RAW_VOLUME,
    },
    RedMeat: {
        id: 'RedMeat',
        icon: Icons.Steak,
        nameId: 'RedMeat',
        type: ItemTypes.RawFood,
        value: 6,
        volume: RAW_VOLUME,
    },
    BoarSkin: {
        id: 'BoarSkin',
        icon: Icons.AnimalHide,
        nameId: 'BoarSkin',
        type: ItemTypes.RawSkin,
        value: 5,
        volume: RAW_VOLUME,
    },
}
