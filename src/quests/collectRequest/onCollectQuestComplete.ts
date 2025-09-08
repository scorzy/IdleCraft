import { GameState } from '../../game/GameState'
import { removeItem } from '../../storage/storageFunctions'
import { selectOutcomeEx } from '../selectors/selectOutcomeEx'
import { selectCollectQuestChosenItems } from './collectSelectors'

export function onCollectQuestComplete(state: GameState, questId: string, outcomeId: string): GameState {
    const outcome = selectOutcomeEx(state, questId, outcomeId)

    if (!outcome.reqItems) return state

    const items = selectCollectQuestChosenItems(state, questId, outcomeId)

    if (!items.isReqCompleted) return state

    const outcomeLocation = outcome.location

    for (const item of items.usedItems) state = removeItem(state, item.itemId, item.quantity, outcomeLocation)

    return state
}
