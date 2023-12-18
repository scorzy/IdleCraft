import { ExpState } from '../experience/ExpState'
import { CharInventory } from './inventory'

export interface CharacterState {
    inventory: CharInventory
    skillsExp: ExpState
    skillsLevel: ExpState
    exp: number
    level: number
    enemy: boolean
    healthPoints: number
    staminaPoints: number
    manaPoints: number

    combatAbilities: string[]
}
