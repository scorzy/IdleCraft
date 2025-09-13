import { regenerateChars } from '../characters/functions/regenerateChars'
import { updateQuests } from '../quests/QuestFunctions'
import { GameState } from './GameState'

export function regenerate(state: GameState, now: number): void {
    if (!state.lastRegen || state.lastRegen < 1) state.lastRegen = now

    const diff = now - state.lastRegen
    if (diff < 0) return

    const toRegen = Math.floor((diff + 300) / 1e3)
    if (toRegen < 1) return

    state.lastRegen = state.lastRegen + toRegen * 1e3

    regenerateChars(state, toRegen)
    updateQuests(state)
}
