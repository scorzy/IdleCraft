import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'
import { InitialState } from '../entityAdapter/InitialState'
import { ItemFilter } from '../items/Item'
import { KillQuestTarget } from './KillQuestTarget'

export enum QuestType {
    KILL = 'KILL',
    COLLECT = 'COLLECT',
}
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
    type: QuestType
    goldReward?: number
    itemsRewards?: ItemsReward[]
    requests: InitialState<QuestRequest>
}
export interface QuestRequest {
    id: string
    type: QuestType
}
export type KillQuestRequest = QuestRequest & {
    type: QuestType.KILL
    targets: KillQuestTarget[]
}
export type CollectQuestRequest = QuestRequest & {
    type: QuestType.COLLECT
    itemCount: number
    itemFilter: ItemFilter
}
export function isKillingQuestRequest(out: QuestRequest | KillQuestRequest): out is KillQuestRequest {
    return out.type === QuestType.KILL
}
export function isCollectQuestRequest(out: QuestRequest | CollectQuestRequest): out is CollectQuestRequest {
    return out.type === QuestType.COLLECT
}

export interface QuestParameter {
    id: string
}
export interface QuestState {
    id: string
    state: QuestStatus
    templateId: string
    parameters: Record<string, QuestParameter>
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

class QuestRequestAdapterInt extends AbstractEntityAdapter<QuestRequest> {
    getId(data: QuestOutcome): string {
        return data.id
    }
}
export const QuestRequestAdapter = new QuestRequestAdapterInt()
