import { deepmerge } from 'deepmerge-ts'
import { GameState } from './GameState'
import { GetInitialGameState } from './InitialGameState'

export function loadData(data: object): GameState {
    const state = deepmerge(GetInitialGameState(), data) as GameState

    return state
}
