import { GameState } from '../game/GameState'
import { Icons } from '../icons/Icons'
import { QuestParameter, KillQuestOutcome, CollectQuestOutcome } from './QuestTypes'

export interface QuestTemplate {
    id: string
    getName: (id: string) => (state: GameState) => string
    getDescription: (id: string) => (state: GameState) => string
    nextQuestId?: string
    getIcon: (id: string) => (state: GameState) => Icons
    parameters: Record<string, QuestParameter>
    outcomes: Record<string, KillQuestOutcome | CollectQuestOutcome>
}
