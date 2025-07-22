import { regenerateChars } from '../characters/functions/regenerateChars'
import { updateQuests } from '../quests/QuestFunctions'
import { GameState } from './GameState'

export function regenerate(state: GameState, now: number): GameState {
    if (!state.lastRegen || state.lastRegen < 1) state = { ...state, lastRegen: now }

    const diff = now - state.lastRegen
    if (diff < 0) return state

    const toRegen = Math.floor((diff + 300) / 1e3)
    if (toRegen < 1) return state

    state = { ...state, lastRegen: state.lastRegen + toRegen * 1e3 }

    state = regenerateChars(state, toRegen)
    state = updateQuests(state)

    return state
}
