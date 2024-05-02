import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { equipItem } from '../characters/characterFunctions'
import { useGameStore } from '../game/state'
import { ComboBoxValue } from '../components/ui/comboBox'
import { Msg } from '../msg/Msg'
import { memoize } from '../utils/memoize'
import { Item } from './Item'

export const changeEquip = (slot: EquipSlotsEnum, axeId: string, charId: string) =>
    useGameStore.setState((s) => {
        let stdItemId: string | null = null
        let craftItemId: string | null = null

        if (axeId.startsWith('s')) stdItemId = axeId.slice(1)
        else if (axeId.startsWith('c')) craftItemId = axeId.slice(1)

        return equipItem(s, charId, slot, stdItemId, craftItemId)
    })

export const getItemCombo = memoize(function getItemCombo(item: Item, itemId: string, t: Msg): ComboBoxValue {
    return {
        label: t[item.nameId],
        value: itemId,
        iconId: item.icon,
    }
})
