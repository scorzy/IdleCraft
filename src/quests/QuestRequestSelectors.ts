import { GameState } from '../game/GameState'

export interface QuestRequestSelectors {
    getName: (questId: string, outcomeId: string, requestId: string) => (state: GameState) => string
    getDescription: (questId: string, outcomeId: string, requestId: string) => (state: GameState) => string
    isCompleted: (questId: string, outcomeId: string, requestId: string) => (state: GameState) => boolean
}
