import { BonusResult } from '../bonus/Bonus'
import { GameState } from '../game/GameState'
import { Icons } from '../icons/Icons'
import { DamageData, DamageTypes, Item } from '../items/Item'
import { EquipSlotsEnum } from './equipSlotsEnum'
import { CharTemplateEnum } from './templates/characterTemplateEnum'

export interface CharacterSelector {
    TemplateId: (s: GameState) => CharTemplateEnum
    Name: (state: GameState) => string
    Icon: (state: GameState) => Icons
    Level: (state: GameState) => number
    Exp: (state: GameState) => number
    LevelExp: (state: GameState) => number
    NextLevelExp: (state: GameState) => number
    MaxAttributes: (state: GameState) => number
    AvailableAttributes: (state: GameState) => number
    UsedAttributes: (state: GameState) => number
    HealthPoints: (state: GameState) => number
    StaminaPoint: (state: GameState) => number
    ManaPoints: (state: GameState) => number
    Health: (state: GameState) => number
    Stamina: (state: GameState) => number
    Mana: (state: GameState) => number
    MaxHealth: (state: GameState) => number
    MaxMana: (state: GameState) => number
    MaxStamina: (state: GameState) => number
    MaxHealthList: (state: GameState) => BonusResult
    MaxManaList: (state: GameState) => BonusResult
    MaxStaminaList: (state: GameState) => BonusResult

    armour: Record<
        DamageTypes,
        {
            ArmourList: (state: GameState) => BonusResult
            Armour: (state: GameState) => number
        }
    >

    damage: Record<
        DamageTypes,
        {
            DamageList: (state: GameState) => BonusResult
            Damage: (state: GameState) => number
        }
    >

    AllAttackDamage: (state: GameState) => DamageData

    AttackSpeedList: (state: GameState) => BonusResult
    AttackSpeed: (state: GameState) => number

    EquippedItem: (state: GameState, slot: EquipSlotsEnum) => Item | undefined
    MainWeapon: (state: GameState) => Item | undefined

    AllCharInventory: (state: GameState) => Partial<Record<EquipSlotsEnum, Item>>
}
