import { ExpState } from '../../experience/ExpState'
import { Icons } from '../../icons/Icons'
import { Msg } from '../../msg/Msg'
import { Loot } from '../../storage/storageState'
import { CharInventory } from '../inventory'

export interface CharTemplate {
    nameId: keyof Msg
    iconId: Icons
    inventory: CharInventory
    skillsExp: ExpState
    skillsLevel: ExpState
    level: number
    healthPoints: number
    staminaPoints: number
    manaPoints: number
    loot: Loot[]
}
