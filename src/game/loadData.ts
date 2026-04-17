import { CharacterAdapter } from '../characters/characterAdapter'
import { PLAYER_CHAR, PLAYER_ID } from '../characters/charactersConst'
import { deepMerge } from '../utils/deepMerge'
import { GameState } from './GameState'
import { GetInitialGameState } from './InitialGameState'

export function loadData(data: object): GameState {
    const initial = GetInitialGameState()
    initial.characters = CharacterAdapter.getInitialState()
    const state = deepMerge(initial, data)
    if (!CharacterAdapter.select(state.characters, PLAYER_ID)) CharacterAdapter.create(state.characters, PLAYER_CHAR)

    return state
}
