import { CharAbility } from '../activeAbilities/abilityInterfaces'
import { InitialState } from '../entityAdapter/entityAdapter'
import { ExpState } from '../experience/ExpState'
import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'
import { PerkState } from '../perks/PerkState'
import { CharInventory } from './inventory'

export interface CharacterState {
    id: string
    iconId: Icons
    name?: string
    nameId?: keyof Msg
    inventory: CharInventory
    skillsExp: ExpState
    skillsLevel: ExpState
    exp: number
    level: number
    perks: PerkState
    isEnemy: boolean
    healthPoints: number
    staminaPoints: number
    manaPoints: number

    health: number
    stamina: number
    mana: number

    combatAbilities: string[]
    allCombatAbilities: InitialState<CharAbility>
    lastCombatAbilityNum: number
    lastCombatAbilityId: string | null
}
