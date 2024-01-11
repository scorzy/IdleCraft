import { GameState } from '../game/GameState'
import { CharacterAdapter } from './characterAdapter'
import { PLAYER_ID } from './charactersConst'

const selectMaxAttributes = (state: GameState, characterId: string) =>
    CharacterAdapter.selectEx(state.characters, characterId).level

const selectUsedAttributes = (state: GameState, characterId: string) => {
    const char = CharacterAdapter.selectEx(state.characters, characterId)
    return Math.floor(char.healthPoints + char.staminaPoints + char.manaPoints)
}

export const selectCharacterMaxAttr = (charId: string) => (state: GameState) => selectMaxAttributes(state, charId)
export const selectCharacterUsedAttr = (charId: string) => (state: GameState) => selectUsedAttributes(state, charId)

export const selectPlayerAvAttr = (state: GameState) =>
    selectMaxAttributes(state, PLAYER_ID) - selectUsedAttributes(state, PLAYER_ID)

const selectHealthPoints = (state: GameState, characterId: string) =>
    CharacterAdapter.selectEx(state.characters, characterId).healthPoints
const selectStaminaPoint = (state: GameState, characterId: string) =>
    CharacterAdapter.selectEx(state.characters, characterId).staminaPoints
const selectManaPoints = (state: GameState, characterId: string) =>
    CharacterAdapter.selectEx(state.characters, characterId).manaPoints

export const selectPlayerHealthPoints = (state: GameState) => selectHealthPoints(state, PLAYER_ID)
export const selectPlayerStaminaPoints = (state: GameState) => selectStaminaPoint(state, PLAYER_ID)
export const selectPlayerManaPoints = (state: GameState) => selectManaPoints(state, PLAYER_ID)
