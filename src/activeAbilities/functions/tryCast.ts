import { CharacterAdapter } from '../../characters/characterAdapter'
import { GameState } from '../../game/GameState'
import { ActiveAbilityData } from '../ActiveAbilityData'
import { AbilitiesEnum } from '../abilitiesEnum'

export function tryCast(state: GameState, characterId: string, abilityId: AbilitiesEnum): boolean {
    const ability = ActiveAbilityData.get(abilityId)
    if (!ability) throw new Error(`[execAbility] ability ${abilityId} not found`)

    const character = CharacterAdapter.selectEx(state.characters, characterId)

    const hCost = ability.getHealthCost({ state, characterId })
    if (hCost > character.health + 1) return false

    const sCost = ability.getStaminaCost({ state, characterId })
    if (sCost > character.stamina) return false

    const mCost = ability.getManaCost({ state, characterId })
    if (mCost > character.mana) return false

    const char = CharacterAdapter.selectEx(state.characters, characterId)
    const charUp = { health: char.health - hCost, stamina: char.stamina - sCost, mana: char.mana - mCost }

    CharacterAdapter.update(state.characters, characterId, charUp)

    return true
}
