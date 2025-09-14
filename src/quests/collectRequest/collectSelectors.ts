import { uniq } from 'es-toolkit/compat'
import { GameState } from '../../game/GameState'
import { selectTranslations } from '../../msg/useTranslations'
import { selectTotalFilteredQta } from '../../storage/StorageSelectors'
import { StorageState } from '../../storage/storageTypes'
import { selectOutcomeEx } from '../selectors/selectOutcomeEx'
import { selectOutcome } from '../selectors/selectOutcome'
import { QuestRequestSelectors } from '../selectors/QuestRequestSelectors'

export const selectQuestItemsReqIds = (state: GameState, questId: string, outcomeId: string) => {
    const reqItems = selectOutcome(state, questId, outcomeId)?.reqItems
    if (!reqItems) return []
    return reqItems.map((r) => r.id)
}
export const selectItemReq = (state: GameState, questId: string, outcomeId: string, reqId: string) => {
    const reqItems = selectOutcome(state, questId, outcomeId)?.reqItems
    if (!reqItems) return null
    return reqItems.find((r) => r.id === reqId)
}

export function isCollectReq(state: GameState, questId: string, outcomeId: string): boolean {
    return !!selectOutcome(state, questId, outcomeId)?.reqItems
}

export const selectCollectQuestItemValue = (
    state: GameState,
    questId: string,
    outcomeId: string,
    reqId: string,
    itemIndex: number
) => {
    const outcome = selectOutcome(state, questId, outcomeId)
    const req = outcome?.reqItems?.find((e) => e.id === reqId)
    if (!req) return

    if (itemIndex === 0) return req.selectedItem1
    else if (itemIndex === 1) return req.selectedItem2
    else if (itemIndex === 2) return req.selectedItem3
}

export const selectCollectQuestTotalQta = (state: GameState, questId: string, outcomeId: string, reqId: string) => {
    const outcome = selectOutcome(state, questId, outcomeId)
    if (!outcome) return 0
    if (!outcome.reqItems) return 0

    const req = outcome.reqItems.find((r) => r.id === reqId)
    if (!req) return 0

    return selectTotalFilteredQta(state, outcome.location, req.itemFilter)
}
export const CollectQuestRequestSelectors: QuestRequestSelectors = {
    getDescription: (_questId: string, _outcomeId: string) => (state: GameState) =>
        selectTranslations(state).t.collectReqDesc,

    isCompleted: (questId: string, outcomeId: string) => (state: GameState) =>
        Object.values(selectCollectQuestChosenItems(state, questId, outcomeId).isReqCompleted).every((c) => c),
}
export interface CollectRequestStatus {
    usedItems: { itemId: string; quantity: number }[]
    isReqCompleted: Record<string, boolean>
}
export const selectCollectQuestChosenItems = (state: GameState, questId: string, outcomeId: string) => {
    const reqItems = selectOutcomeEx(state, questId, outcomeId).reqItems
    const storage = state.locations[selectOutcomeEx(state, questId, outcomeId).location].storage

    const ret: CollectRequestStatus = {
        isReqCompleted: {},
        usedItems: [],
    }
    if (!reqItems) return ret

    const usedItems: StorageState = {}

    for (const reqItem of reqItems) {
        const itemIds = uniq([reqItem.selectedItem1, reqItem.selectedItem2, reqItem.selectedItem3]).filter(
            (s) => s !== undefined
        )
        let remaining = reqItem.itemCount

        for (const selectedItem of itemIds) {
            if (remaining < Number.EPSILON) continue
            const available = (storage[selectedItem] ?? 0) - (usedItems[selectedItem] ?? 0)
            if (available < Number.EPSILON) continue

            const maxUsed = Math.min(remaining, available)
            if (maxUsed < Number.EPSILON) continue

            remaining -= maxUsed
            usedItems[selectedItem] = (usedItems[selectedItem] ?? 0) + maxUsed

            const retItem = ret.usedItems.find((r) => r.itemId === selectedItem)

            if (retItem) retItem.quantity += maxUsed
            else {
                const retItemAdd = {
                    itemId: selectedItem,
                    quantity: maxUsed,
                }
                ret.usedItems.push(retItemAdd)
            }
        }

        ret.isReqCompleted[reqItem.id] = remaining < Number.EPSILON
    }
    return ret
}
