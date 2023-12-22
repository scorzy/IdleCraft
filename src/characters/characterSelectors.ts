import { GameState } from '../game/GameState'
import { CharacterStateAdapter } from './characterAdapter'
import { PLAYER_ID } from './charactersConst'

const selectMaxAttributes = (state: GameState, characterId: string) =>
    CharacterStateAdapter.selectEx(state.characters, characterId).level
const selectUsedAttributes = (state: GameState, characterId: string) => {
    const char = CharacterStateAdapter.selectEx(state.characters, characterId)
    return char.healthPoints + char.staminaPoints + char.manaPoints
}

export const selectPlayerMaxAttr = (state: GameState) => selectMaxAttributes(state, PLAYER_ID)
export const selectPlayerUsedAttr = (state: GameState) => selectUsedAttributes(state, PLAYER_ID)
export const selectPlayerAvAttr = (state: GameState) =>
    selectMaxAttributes(state, PLAYER_ID) - selectUsedAttributes(state, PLAYER_ID)

const selectHealthPoints = (state: GameState, characterId: string) =>
    CharacterStateAdapter.selectEx(state.characters, characterId).healthPoints
const selectStaminaPoint = (state: GameState, characterId: string) =>
    CharacterStateAdapter.selectEx(state.characters, characterId).staminaPoints
const selectManaPoints = (state: GameState, characterId: string) =>
    CharacterStateAdapter.selectEx(state.characters, characterId).manaPoints

export const selectPlayerHealthPoints = (state: GameState) => selectHealthPoints(state, PLAYER_ID)
export const selectPlayerStaminaPoints = (state: GameState) => selectStaminaPoint(state, PLAYER_ID)
export const selectPlayerManaPoints = (state: GameState) => selectManaPoints(state, PLAYER_ID)
