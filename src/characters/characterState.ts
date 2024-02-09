import { CharAbility } from '../activeAbilities/abilityInterfaces'
import { ExpState } from '../experience/ExpState'
import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'
import { PerkState } from '../perks/PerkState'
import { PerksEnum } from '../perks/perksEnum'
import { CharInventory } from './inventory'
import { InitialState } from '@/entityAdapter/InitialState'

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
    selectedAbilityId?: string
    selectedPerk?: PerksEnum
}
