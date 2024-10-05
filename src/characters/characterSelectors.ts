import { GameState } from '../game/GameState'
import { CharacterAdapter } from './characterAdapter'
import { PLAYER_ID } from './charactersConst'

const selectCharLevel = (state: GameState, characterId: string) =>
    CharacterAdapter.selectEx(state.characters, characterId).level

const selectMaxAttributes = (state: GameState, characterId: string) => selectCharLevel(state, characterId)

const selectUsedAttributes = (state: GameState, characterId: string) => {
    const char = CharacterAdapter.selectEx(state.characters, characterId)
    return Math.floor(char.healthPoints + char.staminaPoints + char.manaPoints)
}

export const selectPlayerAvAttr = (state: GameState) =>
    selectMaxAttributes(state, PLAYER_ID) - selectUsedAttributes(state, PLAYER_ID)
