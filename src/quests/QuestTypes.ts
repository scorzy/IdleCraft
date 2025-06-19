import { CharTemplateEnum } from '../characters/templates/characterTemplateEnum'
import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'
import { Icons } from '../icons/Icons'
import { ItemFilter } from '../items/Item'
import { Msg } from '../msg/Msg'

export enum QuestType {
    KILL = 'kill',
    COLLECT = 'collect',
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
export interface QuestTemplate {
    id: string
    nameId: keyof Msg
    descriptionId: keyof Msg
    nextQuestId?: string
    icon: Icons
    outcomes: Record<string, QuestOutcome>
}

export interface QuestState {
    id: string
    templateId: string
    outcomeData: Record<string, QuestOutcomeData>
}

class QuestAdapterInt extends AbstractEntityAdapter<QuestState> {
    getId(data: QuestState): string {
        return data.id
    }
}
export const QuestAdapter = new QuestAdapterInt()

class QuestTemplateAdapterInt extends AbstractEntityAdapter<QuestTemplate> {
    getId(data: QuestTemplate): string {
        return data.id
    }
}
export const QuestTemplateAdapter = new QuestTemplateAdapterInt()
