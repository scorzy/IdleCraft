import { CharacterAdapter } from '../characters/characterAdapter'
import { PLAYER_CHAR, PLAYER_ID } from '../characters/charactersConst'
import { ActivityTypes } from '../activities/ActivityState'
import { GameLocationAdapter } from '../gameLocations/GameLocationAdapter'
import { deepMerge } from '../utils/deepMerge'
import { GameState } from './GameState'
import { GetInitialGameState } from './InitialGameState'

const removeLegacyCraftingResults = (state: GameState) => {
    Reflect.deleteProperty(state.craftingForm, 'result')
    for (const activity of Object.values(state.activities.entries)) {
        if (activity?.type === ActivityTypes.Crafting) Reflect.deleteProperty(activity, 'result')
    }
}

export function loadData(data: object): GameState {
    const initial = GetInitialGameState()
    initial.characters = CharacterAdapter.getInitialState()
    const saveData = { ...data } as Partial<GameState> & { caravanSlots?: unknown; locations?: unknown }
    const legacyCaravanSlots = saveData.caravanSlots
    delete saveData.caravanSlots
    if ('locations' in saveData) saveData.locations = GameLocationAdapter.load(saveData.locations)
    const state = deepMerge(initial, saveData as Partial<GameState>)
    if (typeof saveData.pageUnlockProgressionEnabled !== 'boolean') state.pageUnlockProgressionEnabled = false
    if (typeof legacyCaravanSlots === 'number')
        GameLocationAdapter.selectEx(state.locations, state.location).caravanSlots = legacyCaravanSlots
    if (!CharacterAdapter.select(state.characters, PLAYER_ID)) CharacterAdapter.create(state.characters, PLAYER_CHAR)

    removeLegacyCraftingResults(state)

    return state
}
