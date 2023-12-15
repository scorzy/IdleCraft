import { GameState } from '../game/GameState'
import { useGameStore } from '../game/state'
import { PerksEnum } from './perksEnum'

export const SetPerk = (perk: PerksEnum) => () => useGameStore.setState((s: GameState) => ({ ui: { ...s.ui, perk } }))
const acquirePerk = (perk: PerksEnum) => (state: GameState) => {
    const have = state.perks[perk] ?? 0
    state = { ...state, perks: { ...state.perks, [perk]: have + 1 } }
    return state
}
export const acquirePerkClick = (perk: PerksEnum) => () => useGameStore.setState(acquirePerk(perk))
