import { GameState } from '../../game/GameState'
import { QuestAdapter, QuestOutcomeAdapter } from '../QuestTypes'

export const selectOutcome = (state: GameState, questId: string, outcomeId: string) => {
    if (!questId || !outcomeId) return null
    const quest = QuestAdapter.selectEx(state.quests, questId)
    return QuestOutcomeAdapter.select(quest.outcomeData, outcomeId) || null
}
