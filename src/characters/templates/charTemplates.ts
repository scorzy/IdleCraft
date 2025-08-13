import { ExpState } from '../../experience/ExpState'
import { Icons } from '../../icons/Icons'
import { Msg } from '../../msg/Msg'
import { Loot } from '../../storage/storageTypes'
import { CharInventory } from '../inventory'
import { CharTemplateEnum } from './characterTemplateEnum'

export interface CharTemplate {
    id: CharTemplateEnum
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
