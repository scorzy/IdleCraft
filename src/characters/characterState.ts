import { ExpState } from '../experience/ExpState'
import { CharInventory } from './inventory'

export interface CharacterState {
    inventory: CharInventory
    skillsExp: ExpState
    skillsLevel: ExpState
    exp: number
    level: number
}
