import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'
import { InitialState } from '../entityAdapter/InitialState'
import { GameLocations } from '../gameLocations/GameLocations'
import { ItemRequest } from './ItemRequest'
import { KillQuestTarget } from './KillQuestTarget'

export enum QuestStatus {
    ACCEPTED = 'ACCEPTED',
    AVAILABLE = 'AVAILABLE',
}

export interface ItemsReward {
    itemId: string
    quantity: number
}
export interface QuestOutcome {
    id: string
    location: GameLocations
    goldReward?: number
    itemsRewards?: ItemsReward[]
    targets?: KillQuestTarget[]
    reqItems?: ItemRequest[]
}
export interface QuestState {
    id: string
    state: QuestStatus
    expandedOutcome: string
    templateId: string
    parameters: Record<string, number | string>
    outcomeData: InitialState<QuestOutcome>
}

class QuestAdapterInt extends AbstractEntityAdapter<QuestState> {
    getId(data: QuestState): string {
        return data.id
    }
}
export const QuestAdapter = new QuestAdapterInt()

class QuestOutcomeAdapterInt extends AbstractEntityAdapter<QuestOutcome> {
    getId(data: QuestOutcome): string {
        return data.id
    }
}
export const QuestOutcomeAdapter = new QuestOutcomeAdapterInt()
