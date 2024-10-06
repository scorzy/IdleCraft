import { memoize } from 'proxy-memoize'
import { default as microMemoize } from 'micro-memoize'
import { GameState } from '../game/GameState'
import { getCharLevelExp } from '../experience/expSelectors'
import { selectTranslations } from '../msg/useTranslations'
import { Bonus, BonusResult } from '../bonus/Bonus'
import { bonusFromItem, getTotal } from '../bonus/BonusFunctions'
import { DamageData, DamageTypes, Item } from '../items/Item'
import { Icons } from '../icons/Icons'
import { selectGameItem, selectGameItemFromCraft, selectInventoryNoQta } from '../storage/StorageSelectors'
import { CharacterAdapter } from './characterAdapter'
import { CharacterSelector } from './CharacterSelector'
import { selectMaxHealthFromChar } from './selectors/healthSelectors'
import { selectMaxManaFromChar } from './selectors/manaSelectors'
import { selectMaxStaminaFromChar } from './selectors/staminaSelectors'
import { EquipSlotsEnum } from './equipSlotsEnum'

export const makeCharacterSelector: (charId: string) => CharacterSelector = (charId: string) => {
    const selChar = memoize((s: GameState) => CharacterAdapter.selectEx(s.characters, charId))

    const Name = memoize((state: GameState) => {
        const char = CharacterAdapter.selectEx(state.characters, charId)
        if (char.name) return char.name
        const t = selectTranslations(state)
        const nameId = char.nameId
        if (!nameId) throw new Error('name not found')
        return t.t[nameId]
    })

    const Icon = memoize((state: GameState) => CharacterAdapter.selectEx(state.characters, charId).iconId)

    const Level = memoize((s: GameState) => selChar(s).level)
    const Exp = memoize((s: GameState) => selChar(s).exp)
    const LevelExp = memoize((s: GameState) => getCharLevelExp(selChar(s).level))
    const NextLevelExp = memoize((s: GameState) => getCharLevelExp(selChar(s).level + 1))

    const MaxAttributes = memoize((s: GameState) => Level(s))
    const UsedAttributes = memoize((s: GameState) => {
        const char = selChar(s)
        return Math.floor(char.healthPoints + char.staminaPoints + char.manaPoints)
    })
    const AvailableAttributes = memoize((s: GameState) => MaxAttributes(s) - UsedAttributes(s))

    const HealthPoints = memoize((s: GameState) => selChar(s).healthPoints)
    const StaminaPoint = memoize((s: GameState) => selChar(s).staminaPoints)
    const ManaPoints = memoize((s: GameState) => selChar(s).manaPoints)

    const Health = memoize((s: GameState) => selChar(s).health)
    const Stamina = memoize((s: GameState) => selChar(s).stamina)
    const Mana = memoize((s: GameState) => selChar(s).mana)

    const MaxHealthList = memoize((s: GameState) => selectMaxHealthFromChar(selChar(s)))
    const MaxManaList = memoize((s: GameState) => selectMaxManaFromChar(selChar(s)))
    const MaxStaminaList = memoize((s: GameState) => selectMaxStaminaFromChar(selChar(s)))

    const MaxHealth = memoize((state: GameState) => MaxHealthList(state).total)
    const MaxMana = memoize((state: GameState) => MaxManaList(state).total)
    const MaxStamina = memoize((state: GameState) => MaxStaminaList(state).total)

    const EquippedItem = microMemoize((slot: EquipSlotsEnum) =>
        memoize((s: GameState) => {
            const equipped = selChar(s).inventory[slot]
            if (!equipped) return
            return selectGameItem(equipped.itemId)(s)
        })
    )

    const MainWeapon = memoize(
        (s: GameState) => EquippedItem(EquipSlotsEnum.MainHand)(s) ?? EquippedItem(EquipSlotsEnum.TwoHand)(s)
    )

    const AllCharInventory = memoize((state: GameState) => {
        const inventory = selectInventoryNoQta(charId)(state)
        const crafted = state.craftedItems

        const ret: { [k in EquipSlotsEnum]?: Item } = {}
        Object.entries(inventory).forEach((kv) => {
            const slot = kv[0] as EquipSlotsEnum
            const itemIds = kv[1]
            const item = selectGameItemFromCraft(itemIds.itemId, crafted)
            if (item) ret[slot] = item
        })
        return ret
    })

    const makeArmourSelectors = (type: DamageTypes) => {
        const ArmourList = memoize((state: GameState) => {
            const inventory = AllCharInventory(state)

            const bonuses: Bonus[] = []

            Object.entries(inventory).forEach((kv) => {
                const item = kv[1]
                if (!item.armourData) return
                const add = item.armourData[type]
                if (add && add !== 0)
                    bonuses.push(
                        bonusFromItem(item, {
                            add,
                        })
                    )
            })

            const bonusList: BonusResult = {
                bonuses,
                total: getTotal(bonuses),
            }
            return bonusList
        })

        const Armour = memoize((state: GameState) => ArmourList(state).total)

        return {
            ArmourList,
            Armour,
        }
    }

    const armour: Record<
        DamageTypes,
        {
            ArmourList: (state: GameState) => BonusResult
            Armour: (state: GameState) => number
        }
    > = {
        Bludgeoning: makeArmourSelectors(DamageTypes.Bludgeoning),
        Piercing: makeArmourSelectors(DamageTypes.Piercing),
        Slashing: makeArmourSelectors(DamageTypes.Slashing),
    }

    const makeDamageSelectors = (type: DamageTypes) => {
        const DamageList = memoize((state: GameState) => {
            const weapon = MainWeapon(state)

            const bonuses: Bonus[] = []

            if (weapon && weapon.weaponData) {
                const add = weapon.weaponData.damage[type]
                if (add)
                    bonuses.push({
                        id: `w_${weapon.id}`,
                        add,
                        iconId: weapon.icon,
                        nameId: weapon.nameId,
                    })
            } else
                bonuses.push({
                    id: 'unharmed',
                    add: 30,
                    iconId: Icons.Punch,
                    nameId: 'Unharmed',
                })

            const bonusList: BonusResult = {
                bonuses,
                total: getTotal(bonuses),
            }

            return bonusList
        })
        const Damage = memoize((state: GameState) => DamageList(state).total)

        return {
            DamageList,
            Damage,
        }
    }

    const damage: Record<
        DamageTypes,
        {
            DamageList: (state: GameState) => BonusResult
            Damage: (state: GameState) => number
        }
    > = {
        Bludgeoning: makeDamageSelectors(DamageTypes.Bludgeoning),
        Piercing: makeDamageSelectors(DamageTypes.Piercing),
        Slashing: makeDamageSelectors(DamageTypes.Slashing),
    }

    const AllAttackDamage = memoize((s: GameState) => {
        const ret: DamageData = {}

        Object.values(DamageTypes).forEach((type: DamageTypes) => {
            const totDamage = damage[type].Damage(s)
            if (totDamage > 0) ret[type] = totDamage
        })
        return ret
    })

    const AttackSpeedList = memoize((s: GameState) => {
        const weapon = MainWeapon(s)
        const bonuses: Bonus[] = []

        if (weapon && weapon.weaponData) {
            bonuses.push({
                id: `w_${weapon.id}`,
                add: weapon.weaponData.attackSpeed,
                iconId: weapon.icon,
                nameId: weapon.nameId,
            })
        } else
            bonuses.push({
                id: 'unharmed',
                add: 5e3,
                iconId: Icons.Punch,
                nameId: 'Unharmed',
            })

        const bonusList: BonusResult = {
            bonuses,
            total: getTotal(bonuses),
        }

        return bonusList
    })

    const AttackSpeed = memoize((s: GameState) => AttackSpeedList(s).total)

    return {
        Name,
        Icon,
        Level,
        Exp,
        AvailableAttributes,
        LevelExp,
        NextLevelExp,
        MaxAttributes,
        UsedAttributes,
        HealthPoints,
        StaminaPoint,
        ManaPoints,
        Health,
        Stamina,
        Mana,
        MaxHealth,
        MaxMana,
        MaxStamina,
        MaxHealthList,
        MaxManaList,
        MaxStaminaList,
        armour,
        damage,
        AllAttackDamage,
        AttackSpeedList,
        AttackSpeed,
        EquippedItem,
        MainWeapon,
        AllCharInventory,
    }
}
