import { InitialState } from '../../entityAdapter/entityAdapter'
import { GameState } from '../../game/GameState'
import { Item } from '../../items/Item'
import { selectGameItemFromCraft, selectInventoryNoQta } from '../../storage/StorageSelectors'
import { InventoryNoQta } from '../../storage/storageState'
import { memoize } from '../../utils/memoize'
import { EquipSlotsEnum } from '../equipSlotsEnum'

export type InventoryItems = { [k in EquipSlotsEnum]?: Item }

export function selectAllCharInventory(state: GameState, charId: string) {
    const inventory = selectInventoryNoQta(charId)(state)
    const crafted = state.craftedItems

    return selectAllCharInventoryInt(inventory, crafted)
}
const selectAllCharInventoryInt = memoize((inventory: InventoryNoQta, crafted: InitialState<Item>) => {
    const ret: { [k in EquipSlotsEnum]?: Item } = {}
    Object.entries(inventory).forEach((kv) => {
        const slot = kv[0] as EquipSlotsEnum
        const itemIds = kv[1]
        const item = selectGameItemFromCraft(itemIds.stdItemId, itemIds.craftItemId, crafted)
        if (item) ret[slot] = item
    })
    return ret
})
