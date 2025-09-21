import { ExpEnum } from '../../experience/ExpEnum'
import { Icons } from '../../icons/Icons'
import { Item, ItemTypes } from '../../items/Item'

export const CharItems: Record<string, Item> = {
    BoarTusk: {
        id: 'BoarTusk',
        nameId: 'BoarTusk',
        icon: Icons.Boar,
        type: ItemTypes.TwoHands,
        value: 0,
        weaponData: {
            attackSpeed: 6e3,
            expType: ExpEnum.TwoHanded,
            damage: {
                Piercing: 10,
                Bludgeoning: 0,
                Slashing: 0,
            },
        },
    },
}
