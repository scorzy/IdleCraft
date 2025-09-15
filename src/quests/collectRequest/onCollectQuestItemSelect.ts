import { GameState } from '../../game/GameState'
import { setState } from '../../game/setState'
import { ItemRequest } from '../ItemRequest'
import { selectOutcome } from '../selectors/selectOutcome'

export const onCollectQuestItemSelect = (
    questId: string,
    outcomeId: string,
    reqId: string,
    itemIndex: number,
    value: string | undefined
) =>
    setState((state: GameState) => {
        const outcome = selectOutcome(state, questId, outcomeId)
        const reqItems = outcome?.reqItems
        if (!reqItems) return

        const index = reqItems.findIndex((e) => e.id === reqId)
        const oldReq = reqItems[index]
        if (!oldReq) return

        let newReq: ItemRequest[] = []
        if (itemIndex === 0) newReq = reqItems.with(index, { ...oldReq, selectedItem1: value })
        else if (itemIndex === 1) newReq = reqItems.with(index, { ...oldReq, selectedItem2: value })
        else if (itemIndex === 2) newReq = reqItems.with(index, { ...oldReq, selectedItem3: value })

        outcome.reqItems = newReq
    })
