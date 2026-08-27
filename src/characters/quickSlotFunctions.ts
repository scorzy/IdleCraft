import { applyPotionEffects } from '../alchemy/alchemyFunctions'
import { GameState } from '../game/GameState'
import { setState } from '../game/setState'
import { ItemTypes } from '../items/Item'
import { selectGameItem, selectItemQta } from '../storage/StorageSelectors'
import { addItem, removeCraftItemIfUnused, removeItem } from '../storage/storageFunctions'
import { CharacterAdapter } from './characterAdapter'
import { getQuickSlotEquipSlot } from './selectors/quickSlotSelectors'

const isQuickSlotIndex = (index: number) =>
    Number.isInteger(index) && index >= 0 && getQuickSlotEquipSlot(index) !== undefined

export function equipQuickSlot(
    state: GameState,
    charId: string,
    index: number,
    itemId: string | null = null,
    quantity?: number
): void {
    const char = CharacterAdapter.select(state.characters, charId)
    const slot = getQuickSlotEquipSlot(index)
    if (!char || !slot || !isQuickSlotIndex(index)) return

    const equipped = char.inventory[slot]
    if (itemId === null) {
        if (equipped) addItem(state, equipped.itemId, equipped.quantity ?? 1)
        delete char.inventory[slot]
        return
    }

    if (typeof itemId !== 'string') return

    const item = selectGameItem(itemId)(state)
    if (
        !item ||
        item.type !== ItemTypes.Potion ||
        quantity === undefined ||
        !Number.isSafeInteger(quantity) ||
        quantity < 1
    )
        return

    const available = selectItemQta(null, itemId)(state) + (equipped?.itemId === itemId ? (equipped.quantity ?? 1) : 0)
    if (quantity > available) return

    if (equipped) addItem(state, equipped.itemId, equipped.quantity ?? 1)
    // Register the new equipment before removing it from storage. This keeps
    // crafted potions alive when the last stored unit is equipped.
    char.inventory[slot] = { itemId, quantity }
    removeItem(state, itemId, quantity)
}

export const equipQuickSlotClick = (charId: string, index: number, itemId: string | null = null, quantity?: number) =>
    setState((state) => equipQuickSlot(state, charId, index, itemId, quantity))

export function consumeQuickSlotPotion(state: GameState, charId: string, index: number): void {
    const char = CharacterAdapter.select(state.characters, charId)
    const slot = getQuickSlotEquipSlot(index)
    if (!char || !slot || !isQuickSlotIndex(index)) return

    const quickSlot = char.inventory[slot]
    const quantity = quickSlot?.quantity ?? 1
    if (!quickSlot || !Number.isSafeInteger(quantity) || quantity < 1) return

    const item = selectGameItem(quickSlot.itemId)(state)
    if (!item || item.type !== ItemTypes.Potion || !item.potionData) return

    applyPotionEffects(state, charId, item)
    if (quantity === 1) {
        delete char.inventory[slot]
        removeCraftItemIfUnused(state, item.id)
    } else quickSlot.quantity = quantity - 1
}

export const consumeQuickSlotPotionClick = (charId: string, index: number) =>
    setState((state) => consumeQuickSlotPotion(state, charId, index))
