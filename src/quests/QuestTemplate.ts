import { GameState } from '../game/GameState'
import { GatheringZone } from '../gathering/gatheringZones'
import { Icons } from '../icons/Icons'
import { ItemsReward, QuestState } from './QuestTypes'

export interface GenerateQuestDataData extends Record<string, unknown> {}
export interface QuestTemplate<T extends GenerateQuestDataData> {
    id: string
    nextQuestId?: string
    visible?: boolean
    auto?: boolean
    generateQuestData: (state: GameState, data?: T) => QuestState
    getName: (id: string) => (state: GameState) => string
    getDescription: (id: string) => (state: GameState) => string
    getIcon: (id: string) => (state: GameState) => Icons
    getOutcomeTitle: (questId: string, outcomeId: string) => (state: GameState) => string
    getOutcomeDescription: (questId: string, outcomeId: string) => (state: GameState) => string
    getOutcomeGoldReward: (questId: string, outcomeId: string) => (state: GameState) => number
    getOutcomeItemRewards: (questId: string, outcomeId: string) => (state: GameState) => ItemsReward[]
    getGatheringZoneUnlock?: (questId: string, outcomeId: string) => (state: GameState) => GatheringZone
}
