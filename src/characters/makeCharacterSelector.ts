import { memoize } from 'es-toolkit/compat'
import { GameState } from '../game/GameState'
import { getCharLevelExp } from '../experience/expSelectors'
import { selectTranslations } from '../msg/useTranslations'
import { Bonus, BonusResult } from '../bonus/Bonus'
import { bonusFromItem, getTotal } from '../bonus/BonusFunctions'
import { DamageData, DamageTypes, Item } from '../items/Item'
import { Icons } from '../icons/Icons'
import { createInventoryNoQta, selectGameItem, selectGameItemFromCraft } from '../storage/StorageSelectors'
import { myMemoizeOne } from '../utils/myMemoizeOne'
import { CharacterAdapter } from './characterAdapter'
import { CharacterSelector } from './CharacterSelector'
import { selectMaxHealthFromChar } from './selectors/healthSelectors'
import { selectMaxManaFromChar } from './selectors/manaSelectors'
import { selectMaxStaminaFromChar } from './selectors/staminaSelectors'
import { EquipSlotsEnum } from './equipSlotsEnum'
import { CharTemplateEnum } from './templates/characterTemplateEnum'

export const makeCharacterSelector: (charId: string) => CharacterSelector = (charId: string) => {
    const selChar = (s: GameState) => CharacterAdapter.selectEx(s.characters, charId)

    const TemplateId = (s: GameState) => selChar(s).templateId as CharTemplateEnum

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

    const MaxHealthList = (s: GameState) => selectMaxHealthFromChar(selChar(s))
    const MaxManaList = (s: GameState) => selectMaxManaFromChar(selChar(s))
    const MaxStaminaList = (s: GameState) => selectMaxStaminaFromChar(selChar(s))

    const MaxHealth = (state: GameState) => MaxHealthList(state).total
    const MaxMana = (state: GameState) => MaxManaList(state).total
    const MaxStamina = (state: GameState) => MaxStaminaList(state).total

    const EquippedItem = (s: GameState, slot: EquipSlotsEnum) => {
        const equipped = selChar(s).inventory[slot]
        if (!equipped) return
        return selectGameItem(equipped.itemId)(s)
    }

    const MainWeapon = (s: GameState) =>
        EquippedItem(s, EquipSlotsEnum.MainHand) ?? EquippedItem(s, EquipSlotsEnum.TwoHand)

    const selectInventoryNoQta = (s: GameState) => createInventoryNoQta(selChar(s).inventory)

    const AllCharInventory = (s: GameState) => {
        const inventory = selectInventoryNoQta(s)
        const crafted = s.craftedItems

        const ret: Partial<Record<EquipSlotsEnum, Item>> = {}
        Object.entries(inventory).forEach((kv) => {
            const slot = kv[0] as EquipSlotsEnum
            const itemIds = kv[1]
            const item = selectGameItemFromCraft(itemIds.itemId, crafted)
            if (item) ret[slot] = item
        })
        return ret
    }

    const makeArmourSelectors = (type: DamageTypes) => {
        const ArmourList = (s: GameState) => {
            const bonuses: Bonus[] = []

            const inventory = AllCharInventory(s)

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

        return { ArmourList, Armour }
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
        const DamageList = (s: GameState) => {
            const bonuses: Bonus[] = []
            const weapon = MainWeapon(s)

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

        return { DamageList, Damage }
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

    const AllAttackDamage = myMemoizeOne((s: GameState) => {
        const ret: DamageData = {}

        Object.entries(damage).forEach((kv) => {
            const totDamage = kv[1].Damage(s)
            if (totDamage > 0) ret[kv[0] as DamageTypes] = totDamage
        })

        return ret
    })

    const AttackSpeedList = (s: GameState) => {
        const bonuses: Bonus[] = []
        const weapon = MainWeapon(s)

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
        TemplateId,
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
        MaxHealthListMemo: memoize(MaxHealthList),
        MaxManaListMemo: memoize(MaxManaList),
        MaxStaminaListMemo: memoize(MaxStaminaList),
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
