import { GameState } from '../game/GameState'
import { getCharLevelExp } from '../experience/expSelectors'
import { selectTranslations } from '../msg/useTranslations'
import { Bonus, BonusResult } from '../bonus/Bonus'
import { bonusFromItem, getTotal } from '../bonus/BonusFunctions'
import { DamageData, DamageTypes, Item } from '../items/Item'
import { Icons } from '../icons/Icons'
import { selectGameItem, selectGameItemFromCraft, selectInventoryNoQta } from '../storage/StorageSelectors'
import { myMemoize } from '../utils/myMemoize'
import { myMemoizeOne } from '../utils/myMemoizeOne'
import { CharacterAdapter } from './characterAdapter'
import { CharacterSelector } from './CharacterSelector'
import { selectMaxHealthFromChar } from './selectors/healthSelectors'
import { selectMaxManaFromChar } from './selectors/manaSelectors'
import { selectMaxStaminaFromChar } from './selectors/staminaSelectors'
import { EquipSlotsEnum } from './equipSlotsEnum'

export const makeCharacterSelector: (charId: string) => CharacterSelector = (charId: string) => {
    const selChar = (s: GameState) => CharacterAdapter.selectEx(s.characters, charId)

    const Name = (state: GameState) => {
        const char = CharacterAdapter.selectEx(state.characters, charId)
        if (char.name) return char.name
        const t = selectTranslations(state)
        const nameId = char.nameId
        if (!nameId) throw new Error('name not found')
        return t.t[nameId]
    }

    const Icon = (s: GameState) => selChar(s).iconId

    const Level = (s: GameState) => selChar(s).level
    const Exp = (s: GameState) => selChar(s).exp
    const LevelExp = (s: GameState) => getCharLevelExp(selChar(s).level)
    const NextLevelExp = (s: GameState) => getCharLevelExp(selChar(s).level + 1)

    const MaxAttributes = (s: GameState) => Level(s)
    const UsedAttributes = (s: GameState) => {
        const char = selChar(s)
        return Math.floor(char.healthPoints + char.staminaPoints + char.manaPoints)
    }
    const AvailableAttributes = (s: GameState) => MaxAttributes(s) - UsedAttributes(s)

    const HealthPoints = (s: GameState) => selChar(s).healthPoints
    const StaminaPoint = (s: GameState) => selChar(s).staminaPoints
    const ManaPoints = (s: GameState) => selChar(s).manaPoints

    const Health = (s: GameState) => selChar(s).health
    const Stamina = (s: GameState) => selChar(s).stamina
    const Mana = (s: GameState) => selChar(s).mana

    const MaxHealthList = myMemoizeOne((s: GameState) => selectMaxHealthFromChar(selChar(s)))
    const MaxManaList = myMemoizeOne((s: GameState) => selectMaxManaFromChar(selChar(s)))
    const MaxStaminaList = myMemoizeOne((s: GameState) => selectMaxStaminaFromChar(selChar(s)))

    const MaxHealth = (state: GameState) => MaxHealthList(state).total
    const MaxMana = (state: GameState) => MaxManaList(state).total
    const MaxStamina = (state: GameState) => MaxStaminaList(state).total

    const EquippedItem = myMemoize((slot: EquipSlotsEnum) => (s: GameState) => {
        const equipped = selChar(s).inventory[slot]
        if (!equipped) return
        return selectGameItem(equipped.itemId)(s)
    })

    const MainWeapon = (s: GameState) =>
        EquippedItem(EquipSlotsEnum.MainHand)(s) ?? EquippedItem(EquipSlotsEnum.TwoHand)(s)

    const AllCharInventory = (state: GameState) => {
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
    }

    const makeArmourSelectors = (type: DamageTypes) => {
        const ArmourList = (state: GameState) => {
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
        }

        const Armour = (state: GameState) => ArmourList(state).total

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
        const DamageList = (state: GameState) => {
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
        }
        const Damage = (state: GameState) => DamageList(state).total

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

    const AllAttackDamage = (s: GameState) => {
        const ret: DamageData = {}

        Object.values(DamageTypes).forEach((type: DamageTypes) => {
            const totDamage = damage[type].Damage(s)
            if (totDamage > 0) ret[type] = totDamage
        })
        return ret
    }

    const AttackSpeedList = (s: GameState) => {
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
    }

    const AttackSpeed = (s: GameState) => AttackSpeedList(s).total

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
