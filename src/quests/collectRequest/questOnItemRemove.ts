import { GameState } from '../../game/GameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { ItemRequest } from '../ItemRequest'
import { QuestAdapter, QuestOutcome, QuestOutcomeAdapter } from '../QuestTypes'

export const questOnItemRemove = (state: GameState, itemId: string, location: GameLocations): GameState => {
    QuestAdapter.forEach(state.quests, (quest) => {
        Object.values(quest.outcomeData.entries).forEach((outcome: QuestOutcome) => {
            if (outcome.location !== location) return
            if (!outcome.reqItems) return

            if (
                !outcome.reqItems.some(
                    (r) => r.selectedItem1 === itemId || r.selectedItem2 === itemId || r.selectedItem3 === itemId
                )
            )
                return

            let updated = false
            let newReqItems: ItemRequest[] = [...outcome.reqItems]

            let index = newReqItems.findIndex(
                (r) => r.selectedItem1 === itemId || r.selectedItem2 === itemId || r.selectedItem3 === itemId
            )

            let n = 0
            while (index > -1 && n < 1e3) {
                n++
                const req = newReqItems[index]
                if (req) {
                    updated = true
                    const newReq = {
                        ...req,
                        selectedItem1: req.selectedItem1 === itemId ? undefined : req.selectedItem1,
                        selectedItem2: req.selectedItem2 === itemId ? undefined : req.selectedItem2,
                        selectedItem3: req.selectedItem3 === itemId ? undefined : req.selectedItem3,
                    }

                    newReqItems = newReqItems.with(index, newReq)
                }

                index = newReqItems.findIndex(
                    (r) => r.selectedItem1 === itemId || r.selectedItem2 === itemId || r.selectedItem3 === itemId
                )
            }

            if (updated)
                state = {
                    ...state,
                    quests: QuestAdapter.update(state.quests, quest.id, {
                        outcomeData: QuestOutcomeAdapter.update(quest.outcomeData, outcome.id, {
                            reqItems: newReqItems,
                        }),
                    }),
                }
        })
    })

    return state
}
