import { CharAbility } from '../activeAbilities/types/CharAbility'
import { InitialState } from '../entityAdapter/entityAdapter'
import { ExpState } from '../experience/ExpState'
import { CharInventory } from './inventory'

export interface CharacterState {
    id: string
    inventory: CharInventory
    skillsExp: ExpState
    skillsLevel: ExpState
    exp: number
    level: number
    isEnemy: boolean
    healthPoints: number
    staminaPoints: number
    manaPoints: number

    health: number
    stamina: number
    mana: number

    combatAbilities: string[]
    allCombatAbilities: InitialState<CharAbility>
}
