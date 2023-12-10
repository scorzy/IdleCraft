import { GameState } from '../game/GameState'
import { CharacterState } from './characterState'
import { PLAYER_ID } from './charactersConst'

export function selectCharacter(state: GameState, charId: string): CharacterState {
    const char = state.characters[charId]
    if (!char) throw new Error(`character ${charId} not found`)
    return char
}

export const selectMaxAttributes = (state: GameState, characterId: string) => selectCharacter(state, characterId).level
export const selectUsedAttributes = (state: GameState, characterId: string) => {
    const char = selectCharacter(state, characterId)
    return char.healthPoints + char.staminaPoints + char.manaPoints
}

export const selectPlayerMaxAttr = (state: GameState) => selectMaxAttributes(state, PLAYER_ID)
export const selectPlayerUsedAttr = (state: GameState) => selectUsedAttributes(state, PLAYER_ID)
export const selectPlayerAvAttr = (state: GameState) =>
    selectMaxAttributes(state, PLAYER_ID) - selectUsedAttributes(state, PLAYER_ID)

export const selectHealthPoints = (state: GameState, characterId: string) =>
    selectCharacter(state, characterId).healthPoints
export const selectStaminaPoint = (state: GameState, characterId: string) =>
    selectCharacter(state, characterId).staminaPoints
export const selectManaPoints = (state: GameState, characterId: string) =>
    selectCharacter(state, characterId).manaPoints

export const selectPlayerHealthPoints = (state: GameState) => selectHealthPoints(state, PLAYER_ID)
export const selectPlayerStaminaPoints = (state: GameState) => selectStaminaPoint(state, PLAYER_ID)
export const selectPlayerManaPoints = (state: GameState) => selectManaPoints(state, PLAYER_ID)
