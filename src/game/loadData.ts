import { CharacterAdapter } from '../characters/characterAdapter'
import { PLAYER_CHAR, PLAYER_ID } from '../characters/charactersConst'
import { GameLocationAdapter } from '../gameLocations/GameLocationAdapter'
import { deepMerge } from '../utils/deepMerge'
import { GameState } from './GameState'
import { GetInitialGameState } from './InitialGameState'

export function loadData(data: object): GameState {
    const initial = GetInitialGameState()
    initial.characters = CharacterAdapter.getInitialState()
    const saveData = { ...data } as Partial<GameState> & { locations?: unknown }
    if ('locations' in saveData) saveData.locations = GameLocationAdapter.load(saveData.locations)
    const state = deepMerge(initial, saveData as Partial<GameState>)
    if (!CharacterAdapter.select(state.characters, PLAYER_ID)) CharacterAdapter.create(state.characters, PLAYER_CHAR)

    return state
}
