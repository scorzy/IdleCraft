import { GameState } from '../game/GameState'
import { Icons } from '../icons/Icons'
import { ItemsReward, QuestState } from './QuestTypes'

export interface QuestTemplate {
    id: string
    getName: (id: string) => (state: GameState) => string
    getDescription: (id: string) => (state: GameState) => string
    nextQuestId?: string
    getIcon: (id: string) => (state: GameState) => Icons

    generateQuestData: (state: GameState) => QuestState
    getOutcomeDescription: (questId: string, outcomeId: string) => (state: GameState) => string
    isOutcomeCompleted: (questId: string, outcomeId: string) => (state: GameState) => boolean

    getOutcomeGoldReward: (questId: string, outcomeId: string) => (state: GameState) => number
    getOutcomeItemReward: (questId: string, outcomeId: string) => (state: GameState) => ItemsReward[]
}
