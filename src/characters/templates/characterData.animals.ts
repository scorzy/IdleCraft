import { AbilitiesEnum } from '../../activeAbilities/abilitiesEnum'
import { RAW_VOLUME, FINISHED_VOLUME } from '../../caravans/CaravanConst'
import { Effects } from '../../effects/types/Effects'
import { ExpEnum } from '../../experience/ExpEnum'
import { Icons } from '../../icons/Icons'
import { ItemTypes } from '../../items/Item'
import { WeaponCoatingKind } from '../../weaponCoatings/weaponCoatingTypes'
import type { CharacterDefinition } from './characterInterfaces'

export const AnimalCharacterData: Record<string, CharacterDefinition> = {
    Chicken: {
        nameId: 'Chicken',
        iconId: Icons.Chicken,
        items: {
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
                    damage: { Piercing: 2, Bludgeoning: 0, Slashing: 0 },
                },
            },
            DeadChicken: {
                id: 'DeadChicken',
                icon: Icons.Chicken,
                nameId: 'DeadChicken',
                type: ItemTypes.Corpse,
                value: 5,
                volume: RAW_VOLUME,
                butchering: [{ id: 'WhiteMeat', stdItemId: 'WhiteMeat', qta: 1 }],
            },
        },
        inventory: { TwoHand: { itemId: 'ChickenBeak' } },
        skillsExp: {},
        skillsLevel: {},
        level: 1,
        healthPoints: -9,
        staminaPoints: -8,
        manaPoints: -8,
        loot: [{ quantity: 1, itemId: 'DeadChicken' }],
    },
    Boar: {
        nameId: 'Boar',
        iconId: Icons.Boar,
        items: {
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
                    damage: { Piercing: 10, Bludgeoning: 0, Slashing: 0 },
                },
            },
            DeadBoar: {
                id: 'DeadBoar',
                icon: Icons.Boar,
                nameId: 'DeadBoar',
                type: ItemTypes.Corpse,
                value: 5,
                volume: RAW_VOLUME,
                butchering: [{ id: 'RedMeat', stdItemId: 'RedMeat', qta: 2 }],
            },
        },
        inventory: { TwoHand: { itemId: 'BoarTusk' } },
        skillsExp: {},
        skillsLevel: {},
        level: 2,
        healthPoints: -5,
        staminaPoints: -3,
        manaPoints: -8,
        loot: [{ quantity: 1, itemId: 'DeadBoar' }],
        combatAbilities: [AbilitiesEnum.NormalAttack, AbilitiesEnum.NormalAttack, AbilitiesEnum.ChargedAttack],
        randomizeAbilitiesOrder: true,
    },
    Wolf: {
        nameId: 'Wolf',
        iconId: Icons.WolfHead,
        items: {
            DeadWolf: {
                id: 'DeadWolf',
                icon: Icons.WolfHead,
                nameId: 'DeadWolf',
                type: ItemTypes.Corpse,
                value: 8,
                volume: RAW_VOLUME,
                butchering: [{ id: 'RedMeat', stdItemId: 'RedMeat', qta: 2 }],
            },
        },
        inventory: {},
        skillsExp: {},
        skillsLevel: {},
        level: 3,
        healthPoints: 1,
        staminaPoints: 2,
        manaPoints: -8,
        loot: [{ quantity: 1, itemId: 'DeadWolf' }],
        combatAbilities: [AbilitiesEnum.NormalAttack, AbilitiesEnum.NormalAttack, AbilitiesEnum.ChargedAttack],
        randomizeAbilitiesOrder: true,
    },
    Spider: {
        nameId: 'Spider',
        iconId: Icons.Spider,
        items: {
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
                    damage: { Piercing: 8, Bludgeoning: 0, Slashing: 0 },
                },
            },
            DeadSpider: {
                id: 'DeadSpider',
                icon: Icons.Spider,
                nameId: 'DeadSpider',
                type: ItemTypes.Corpse,
                value: 8,
                volume: RAW_VOLUME,
                butchering: [
                    { id: 'VenomGland', stdItemId: 'VenomGland', qta: 1 },
                    { id: 'SpiderEggSac', stdItemId: 'SpiderEggSac', qta: 1 },
                ],
            },
        },
        inventory: {
            TwoHand: { itemId: 'SpiderMainW' },
        },
        skillsExp: {},
        skillsLevel: {},
        level: 3,
        healthPoints: 1,
        staminaPoints: 2,
        manaPoints: -8,
        loot: [{ quantity: 1, itemId: 'DeadSpider' }],
        weaponCoating: {
            kind: WeaponCoatingKind.Poison,
            charges: Number.POSITIVE_INFINITY,
            iconId: Icons.Poison,
            nameId: 'Spider',
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
