import { memo, useCallback, useMemo } from 'react'
import { useGameStore } from '../../game/state'
import { useTranslations } from '../../msg/useTranslations'
import { selectGameItem, selectItemsByTypeCombo } from '../../storage/StorageSelectors'
import { SlotsData } from '../slotsData'
import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
import { selectEquipId } from '../itemSelectors'
import { changeEquip, getItemCombo } from '../itemFunctions'
import { GameState } from '../../game/GameState'
import { Msg } from '../../msg/Msg'
import { PLAYER_ID } from '../../characters/charactersConst'
import { ComboBoxList, ComboBoxResponsive, ComboBoxValue } from '../../components/ui/comboBox'
import { getItemId } from '../../storage/storageFunctions'

export const EquipItemUi = memo(function EquipItemUi(props: { slot: EquipSlotsEnum; charId?: string }) {
    const { slot } = props
    const charId = props.charId ?? PLAYER_ID
    const { t } = useTranslations()
    const slotData = SlotsData[slot]

    const selectEquipIdMemo = useCallback((state: GameState) => selectEquipId(slot, charId)(state), [slot, charId])
    const selectItemsByTypeMemo = useCallback(
        (state: GameState) => selectItemsByTypeCombo(slotData.ItemType)(state),
        [slotData]
    )

    const itemId = useGameStore(selectEquipIdMemo)
    const itemsId = useGameStore(selectItemsByTypeMemo)
    const handleComboChange = useCallback(
        (status: ComboBoxValue | null) => changeEquip(slot, status?.value ?? '', charId),
        [slot, charId]
    )

    const values: ComboBoxList[] = useMemo(
        () => [
            {
                title: '',
                list: itemsId,
            },
        ],
        [itemsId]
    )

    const item = getItemId(itemId)
    const selectGameItemMemo = useCallback(
        (state: GameState) => selectGameItem(item?.stdItemId, item?.craftItemId)(state),
        [item]
    )
    const selectedItem = useGameStore(selectGameItemMemo)
    const selectedCombo: ComboBoxValue | null = selectedItem && itemId ? getItemCombo(selectedItem, itemId, t) : null

    return (
        <div>
            <span className="text-sm font-medium">{t[slotData.ItemType as keyof Msg]}</span>
            <ComboBoxResponsive values={values} selectedValues={selectedCombo} setSelectedValue={handleComboChange} />
        </div>
    )
})
