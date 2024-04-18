import { memo, useCallback } from 'react'
import { useGameStore } from '../../game/state'
import { useTranslations } from '../../msg/useTranslations'
import { selectItemsByTypeCombo } from '../../storage/StorageSelectors'
import { SlotsData } from '../slotsData'
import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
import { selectEquipId } from '../itemSelectors'
import { changeEquip } from '../itemFunctions'
import { GameState } from '../../game/GameState'
import { Msg } from '../../msg/Msg'
import { PLAYER_ID } from '../../characters/charactersConst'
import { ComboBoxList, ComboBoxResponsive, ComboBoxValue } from '../../components/ui/comboBox'

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

    const values: ComboBoxList[] = [
        {
            title: '',
            list: itemsId,
        },
    ]

    const selectedRecipeId: ComboBoxValue | null = itemsId.find((v) => v.value === itemId) ?? null

    return (
        <div>
            <span className="text-sm font-medium">{t[slotData.ItemType as keyof Msg]}</span>
            <ComboBoxResponsive
                values={values}
                selectedValues={selectedRecipeId}
                setSelectedValue={handleComboChange}
            />
        </div>
    )
})
