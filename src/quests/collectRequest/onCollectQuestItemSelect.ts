import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { ItemRequest } from '../ItemRequest'
import { QuestAdapter, QuestOutcomeAdapter } from '../QuestTypes'
import { selectOutcome } from '../selectors/selectOutcome'

export const onCollectQuestItemSelect = (
    questId: string,
    outcomeId: string,
    reqId: string,
    itemIndex: number,
    value: string | undefined
) =>
    useGameStore.setState((state: GameState) => {
        const outcome = selectOutcome(state, questId, outcomeId)
        const reqItems = outcome?.reqItems
        if (!reqItems) return state

        const index = reqItems.findIndex((e) => e.id === reqId)
        const oldReq = reqItems[index]
        if (!oldReq) return state

        let newReq: ItemRequest[] = []
        if (itemIndex === 0) newReq = reqItems.with(index, { ...oldReq, selectedItem1: value })
        else if (itemIndex === 1) newReq = reqItems.with(index, { ...oldReq, selectedItem2: value })
        else if (itemIndex === 2) newReq = reqItems.with(index, { ...oldReq, selectedItem3: value })

        return {
            ...state,
            quests: QuestAdapter.update(state.quests, questId, {
                outcomeData: QuestOutcomeAdapter.update(
                    QuestAdapter.selectEx(state.quests, questId).outcomeData,
                    outcomeId,
                    {
                        reqItems: newReq,
                    }
                ),
            }),
        }
    })
