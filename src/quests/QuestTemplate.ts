import { GameState } from '../game/GameState'
import { Icons } from '../icons/Icons'
import { ItemsReward, QuestState } from './QuestTypes'

export interface QuestTemplate {
    id: string
    nextQuestId?: string
    generateQuestData: (state: GameState) => QuestState

    getName: (id: string) => (state: GameState) => string
    getDescription: (id: string) => (state: GameState) => string
    getIcon: (id: string) => (state: GameState) => Icons
    getOutcomeTitle: (questId: string, outcomeId: string) => (state: GameState) => string
    getOutcomeDescription: (questId: string, outcomeId: string) => (state: GameState) => string
    getOutcomeGoldReward: (questId: string, outcomeId: string) => (state: GameState) => number
    getOutcomeItemReward: (questId: string, outcomeId: string) => (state: GameState) => ItemsReward[]
}
