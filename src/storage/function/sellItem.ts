import { GameState } from '../../game/GameState'
import { setState } from '../../game/setState'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { GameLocations } from '../../gameLocations/GameLocations'
import { selectGameItem } from '../StorageSelectors'
import { StorageAdapter } from '../storageAdapter'
import { addGold, removeItem } from '../storageFunctions'

export function sellItem(state: GameState, itemId: string, qty: number, location?: GameLocations): number {
    const item = selectGameItem(itemId)(state)
    if (!item || item.unlimited || qty <= 0) return 0

    location = location ?? state.location
    const storage = GameLocationAdapter.selectEx(state.locations, location).storage
    const available = StorageAdapter.select(storage, itemId)?.quantity ?? 0

    const sellQty = Math.min(qty, available)
    if (sellQty <= 0) return 0

    removeItem(state, itemId, sellQty, location)

    const gold = sellQty * item.value
    addGold(state, gold)

    return gold
}

export const sellItemClick = (itemId: string, qty: number, location?: GameLocations) =>
    setState((state) => {
        sellItem(state, itemId, qty, location)
    })
