import { selectCharacter } from '../../characters/characterSelectors'
import { GameState } from '../../game/GameState'
import { ActiveAbilityData } from '../ActiveAbilityData'

export function tryCast(state: GameState, characterId: string, abilityId: string): { cast: boolean; state: GameState } {
    const ability = ActiveAbilityData.get(abilityId)
    if (!ability) throw new Error(`[execAbility] ability ${abilityId} not found`)

    const character = selectCharacter(state, characterId)

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

    let char = selectCharacter(state, characterId)
    char = { ...char, health: char.health - hCost, stamina: char.stamina - sCost, mana: char.mana - mCost }

    return {
        cast: true,
        state: {
            ...state,
            characters: {
                ...state.characters,
                [characterId]: char,
            },
        },
    }
}
