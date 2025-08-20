import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'
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
export interface QuestOutcome {
    id: string
    type: QuestType
    goldReward?: number
    itemReward?: string
    itemCount?: number
}
export interface QuestOutcomeData {
    outcomeId: string
    type: QuestType
}
export type KillQuestOutcome = QuestOutcome & {
    type: QuestType.KILL
    targets: KillQuestTarget[]
}
export type CollectQuestOutcome = QuestOutcome & {
    type: QuestType.COLLECT
    itemCount: number
    itemFilter: ItemFilter
}
export function isKillingOutcome(out: QuestOutcome | KillQuestOutcome): out is KillQuestOutcome {
    return out.type === QuestType.KILL
}
export function isCollectOutcome(out: QuestOutcome | CollectQuestOutcome): out is CollectQuestOutcome {
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
    outcomeData: Record<string, QuestOutcome>
}

class QuestAdapterInt extends AbstractEntityAdapter<QuestState> {
    getId(data: QuestState): string {
        return data.id
    }
}
export const QuestAdapter = new QuestAdapterInt()
