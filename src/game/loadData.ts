import { deepmerge } from 'deepmerge-ts'
import { CharacterAdapter } from '../characters/characterAdapter'
import { PLAYER_CHAR, PLAYER_ID } from '../characters/charactersConst'
import { AlchemyItems } from '../alchemy/alchemyItems'
import { addItem } from '../storage/storageFunctions'
import { GameState } from './GameState'
import { GetInitialGameState } from './InitialGameState'

export function loadData(data: object): GameState {
    //ToDo: check, don't duplicate ids on array

    const initial = GetInitialGameState()
    initial.characters = CharacterAdapter.getInitialState()
    const state = deepmerge(initial, data) as GameState
    if (!CharacterAdapter.select(state.characters, PLAYER_ID)) CharacterAdapter.create(state.characters, PLAYER_CHAR)

    if (import.meta.env.DEV) {
        Object.keys(AlchemyItems).forEach((key) => {
            addItem(state, key, 20)
        })
    }

    return state
}
