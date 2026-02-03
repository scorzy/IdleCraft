import { ExpEnum } from '../../experience/ExpEnum'
import { Icons } from '../../icons/Icons'
import { Item, ItemTypes } from '../../items/Item'

export const CharItems: Record<string, Item> = {
    ChickenBeak: {
        id: 'ChickenBeak',
        nameId: 'Chicken',
        icon: Icons.Chicken,
        type: ItemTypes.TwoHands,
        value: 0,
        weaponData: {
            attackSpeed: 3e3,
            expType: ExpEnum.TwoHanded,
            damage: {
                Piercing: 2,
                Bludgeoning: 0,
                Slashing: 0,
            },
        },
    },
    BoarTusk: {
        id: 'BoarTusk',
        nameId: 'BoarTusk',
        icon: Icons.Boar,
        type: ItemTypes.TwoHands,
        value: 0,
        weaponData: {
            attackSpeed: 4e3,
            expType: ExpEnum.TwoHanded,
            damage: {
                Piercing: 10,
                Bludgeoning: 0,
                Slashing: 0,
            },
        },
    },
}
