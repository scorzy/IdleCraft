import { GameState } from '../../game/GameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { QuestAdapter, QuestOutcome } from '../QuestTypes'

export const questOnItemRemove = (
    state: GameState,
    itemId: string,
    location: GameLocations,
    _quantity?: number
): void => {
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

            const reqItems = outcome.reqItems

            let index = reqItems.findIndex(
                (r) => r.selectedItem1 === itemId || r.selectedItem2 === itemId || r.selectedItem3 === itemId
            )

            let n = 0
            while (index > -1 && n < 1e3) {
                n++
                const req = reqItems[index]
                if (req) {
                    if (req.selectedItem1 === itemId) req.selectedItem1 = undefined
                    if (req.selectedItem2 === itemId) req.selectedItem2 = undefined
                    if (req.selectedItem3 === itemId) req.selectedItem3 = undefined
                }

                index = reqItems.findIndex(
                    (r) => r.selectedItem1 === itemId || r.selectedItem2 === itemId || r.selectedItem3 === itemId
                )
            }
        })
    })
}
