import { CharacterStateAdapter } from '../../characters/characterAdapter'
import { GameState } from '../../game/GameState'
import { ActiveAbilityData } from '../ActiveAbilityData'

export function tryCast(state: GameState, characterId: string, abilityId: string): { cast: boolean; state: GameState } {
    const ability = ActiveAbilityData.get(abilityId)
    if (!ability) throw new Error(`[execAbility] ability ${abilityId} not found`)

    const character = CharacterStateAdapter.selectEx(state.characters, characterId)

    const hCost = ability.getHealthCost({ state, characterId })
    if (hCost > character.health + 1)
        return {
            cast: false,
            state,
        }

    const sCost = ability.getStaminaCost({ state, characterId })
    if (sCost > character.stamina)
        return {
            cast: false,
            state,
        }

    const mCost = ability.getManaCost({ state, characterId })
    if (mCost > character.mana)
        return {
            cast: false,
            state,
        }

    const char = CharacterStateAdapter.selectEx(state.characters, characterId)
    const charUp = { health: char.health - hCost, stamina: char.stamina - sCost, mana: char.mana - mCost }

    return {
        cast: true,
        state: {
            ...state,
            characters: CharacterStateAdapter.update(state.characters, characterId, charUp),
        },
    }
}
