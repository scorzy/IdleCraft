import { CharAbilityAdapter } from '../activeAbilities/abilityAdapters'
import { Icons } from '../icons/Icons'
import { CharacterState } from './characterState'

export const PLAYER_ID = 'Player'
export const PLAYER_CHAR: CharacterState = {
    iconId: Icons.Axe,
    nameId: 'Activities',
    id: PLAYER_ID,
    inventory: {},
    exp: 0,
    level: 0,
    healthPoints: 0,
    manaPoints: 0,
    staminaPoints: 0,
    isEnemy: false,
    perks: {},
    skillsExp: {},
    skillsLevel: {},
    combatAbilities: [],
    allCombatAbilities: CharAbilityAdapter.getInitialState(),
    health: 100,
    mana: 100,
    stamina: 100,
    lastCombatAbilityNum: 0,
    lastCombatAbilityId: null,
}
