import { CharTemplateEnum } from '../characters/templates/characterTemplateEnum'
import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'
import { ItemFilter } from '../items/Item'

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
}
export type KillQuestOutcome = QuestOutcome & {
    type: QuestType.KILL
    targetId: CharTemplateEnum
    targetCount: number
    locationId?: string
}
export type KillOutcomeData = QuestOutcomeData & {
    killed: number
}
export type CollectQuestOutcome = QuestOutcome & {
    type: QuestType.COLLECT
    itemCount: number
    itemFilter: ItemFilter
}
export type CollectOutcomeData = QuestOutcomeData & {
    selectedItemId: string
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
export interface KillQuestParameter extends QuestParameter {
    id: string
    quantity: number
    targetId: keyof typeof CharacterData
}
export interface CollectQuestParameter extends QuestParameter {
    id: string
    quantity: number
    itemFilter: ItemFilter
}
export interface QuestState {
    id: string
    state: QuestStatus
    templateId: string
    parameters: Record<string, QuestParameter>
    outcomeData: Record<string, QuestOutcomeData>
}

class QuestAdapterInt extends AbstractEntityAdapter<QuestState> {
    getId(data: QuestState): string {
        return data.id
    }
}
export const QuestAdapter = new QuestAdapterInt()
