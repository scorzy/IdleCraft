import { FINISHED_VOLUME } from '../../caravans/CaravanConst'
import { Effects } from '../../effects/types/Effects'
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
        volume: FINISHED_VOLUME,
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
        volume: FINISHED_VOLUME,
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
    SpiderMainW: {
        id: 'SpiderMainW',
        nameId: 'Spider',
        icon: Icons.Spider,
        type: ItemTypes.TwoHands,
        value: 0,
        volume: FINISHED_VOLUME,
        weaponData: {
            attackSpeed: 2.5e3,
            expType: ExpEnum.TwoHanded,
            damage: {
                Piercing: 8,
                Bludgeoning: 0,
                Slashing: 0,
            },
        },
    },
    SpiderPoison: {
        id: 'SpiderPoison',
        nameId: 'Spider',
        icon: Icons.Spider,
        type: ItemTypes.Potion,
        value: 0,
        volume: FINISHED_VOLUME,
        potionData: {
            effects: [
                {
                    effect: Effects.DamageRegenHealth,
                    value: 2,
                    duration: 1e4,
                },
            ],
        },
    },
}
