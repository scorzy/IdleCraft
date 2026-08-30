import { AbilitiesEnum } from '../../activeAbilities/abilitiesEnum'
import { startAbility } from '../../activeAbilities/functions/startAbility'
import { GameState } from '../../game/GameState'
import { CharacterAdapter } from '../characterAdapter'
import { autoApplyBestWeaponCoating } from '../../weaponCoatings/weaponCoatingFunctions'

export function startNextAbility(state: GameState, charId: string): void {
    autoApplyBestWeaponCoating(state, charId)
    const char = CharacterAdapter.selectEx(state.characters, charId)

    let done = false
    const len = char.combatAbilities.length
    const pointer = char.lastCombatAbilityId === null ? 0 : (char.lastCombatAbilityNum + 1) % len
    const combatAbilityId = char.combatAbilities[pointer]

    if (combatAbilityId) {
        const combatAbility = char.allCombatAbilities.entries[combatAbilityId]
        if (combatAbility && startAbility(state, charId, combatAbility.abilityId)) {
            done = true

            char.lastCombatAbilityNum = pointer
            char.lastCombatAbilityId = combatAbilityId
        }
    }

    if (done) return

    startAbility(state, charId, AbilitiesEnum.NormalAttack)
    char.lastCombatAbilityNum = pointer
    char.lastCombatAbilityId = AbilitiesEnum.NormalAttack
}
