import { GameState } from '../../game/GameState'

export interface QuestRequestSelectors {
    getDescription: (questId: string, outcomeId: string) => (state: GameState) => string
    isCompleted: (questId: string, outcomeId: string) => (state: GameState) => boolean
}
