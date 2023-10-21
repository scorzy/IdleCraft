import { Item } from './Item'
import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { equipItem } from '../characters/characterFunctions'
import { PLAYER_ID } from '../characters/charactersConst'
import { useGameStore } from '../game/state'

export function loadItem(data: unknown): Item | null {
    if (!data) return null
    if (typeof data !== 'object') return null
    if (!('id' in data)) return null

    return data as Item
}
export const changeEquip = (slot: EquipSlotsEnum, axeId: string) =>
    useGameStore.setState((s) => {
        let stdItemId: string | null = null
        let craftItemId: string | null = null

        if (axeId.startsWith('s')) stdItemId = axeId.slice(1)
        else if (axeId.startsWith('c')) craftItemId = axeId.slice(1)

        return equipItem(s, PLAYER_ID, slot, stdItemId, craftItemId)
    })
