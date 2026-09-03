import { AbilitiesEnum } from '../../activeAbilities/abilitiesEnum'
import { RAW_VOLUME } from '../../caravans/CaravanConst'
import { Effects } from '../../effects/types/Effects'
import { Icons } from '../../icons/Icons'
import { ItemType, CraftingType } from '../../items/Item'
import { WeaponCoatingKind } from '../../weaponCoatings/weaponCoatingTypes'
import type { CharacterDefinition } from './characterInterfaces'

export const AnimalCharacterData: Record<string, CharacterDefinition> = {
    Chicken: {
        nameId: 'Chicken',
        iconId: Icons.Chicken,
        items: {
            DeadChicken: {
                id: 'DeadChicken',
                icon: Icons.Chicken,
                nameId: 'DeadChicken',
                type: ItemType.Crafting,
                craftingTypes: [CraftingType.Corpse],
                value: 5,
                volume: RAW_VOLUME,
                butchering: [{ id: 'WhiteMeat', stdItemId: 'WhiteMeat', qta: 1 }],
            },
        },
        inventory: {},
        skillsExp: {},
        skillsLevel: {},
        level: 1,
        healthPoints: -9,
        staminaPoints: -8,
        manaPoints: -8,
        loot: [{ quantity: 1, itemId: 'DeadChicken' }],
        baseStats: {
            attack: { attackSpeed: 3e3, damage: { Piercing: 2 } },
            defense: {},
        },
    },
    Boar: {
        nameId: 'Boar',
        iconId: Icons.Boar,
        items: {
            DeadBoar: {
                id: 'DeadBoar',
                icon: Icons.Boar,
                nameId: 'DeadBoar',
                type: ItemType.Crafting,
                craftingTypes: [CraftingType.Corpse],
                value: 5,
                volume: RAW_VOLUME,
                butchering: [{ id: 'RedMeat', stdItemId: 'RedMeat', qta: 2 }],
            },
        },
        inventory: {},
        skillsExp: {},
        skillsLevel: {},
        level: 2,
        healthPoints: -5,
        staminaPoints: -3,
        manaPoints: -8,
        loot: [{ quantity: 1, itemId: 'DeadBoar' }],
        baseStats: {
            attack: { attackSpeed: 3.5e3, damage: { Piercing: 10, Bludgeoning: 20, Slashing: 20 } },
            defense: {},
        },
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
                type: ItemType.Crafting,
                craftingTypes: [CraftingType.Corpse],
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
        staminaPoints: 4,
        manaPoints: -9,
        loot: [{ quantity: 1, itemId: 'DeadWolf' }],
        baseStats: {
            attack: { attackSpeed: 4e3, damage: { Bludgeoning: 30, Piercing: 15, Slashing: 20 } },
            defense: {
                Bludgeoning: 20,
                Piercing: 5,
                Slashing: 10,
            },
        },
        combatAbilities: [AbilitiesEnum.NormalAttack, AbilitiesEnum.ChargedAttack],
        randomizeAbilitiesOrder: true,
    },
    Spider: {
        nameId: 'Spider',
        iconId: Icons.Spider,
        items: {
            DeadSpider: {
                id: 'DeadSpider',
                icon: Icons.Spider,
                nameId: 'DeadSpider',
                type: ItemType.Crafting,
                craftingTypes: [CraftingType.Corpse],
                value: 8,
                volume: RAW_VOLUME,
                butchering: [
                    { id: 'VenomGland', stdItemId: 'VenomGland', qta: 1 },
                    { id: 'SpiderEggSac', stdItemId: 'SpiderEggSac', qta: 1 },
                ],
            },
        },
        inventory: {},
        skillsExp: {},
        skillsLevel: {},
        level: 3,
        healthPoints: 1,
        staminaPoints: 2,
        manaPoints: -8,
        loot: [{ quantity: 1, itemId: 'DeadSpider' }],
        baseStats: {
            attack: { attackSpeed: 2.5e3, damage: { Piercing: 25 } },
            defense: {
                Bludgeoning: 5,
                Piercing: 5,
                Slashing: 5,
            },
        },
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
