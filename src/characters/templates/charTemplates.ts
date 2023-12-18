import { ExpState } from '../../experience/ExpState'
import { CharInventory } from '../inventory'

export interface CharTemplate {
    inventory: CharInventory
    skillsExp: ExpState
    skillsLevel: ExpState
    level: number
    healthPoints: number
    staminaPoints: number
    manaPoints: number
}
