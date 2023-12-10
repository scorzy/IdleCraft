import { memo, useCallback } from 'react'
import { useGameStore } from '../../game/state'
import { IconsData } from '../../icons/Icons'
import { useTranslations } from '../../msg/useTranslations'
import {
    getSelectedItem,
    getSelectedItemQta,
    selectSelectedCraftedItemId,
    selectSelectedStdItemId,
} from '../../storage/StorageSelectors'
import { MyCard } from '../../ui/myCard/myCard'
import { Button } from '../../components/ui/button'
import { equipClick } from '../../characters/characterFunctions'
import { PLAYER_ID } from '../../characters/charactersConst'
import { ItemInfo } from './ItemInfo'

export const SelectedItem = memo(function SelectedItem() {
    const qta = useGameStore(getSelectedItemQta)
    const item = useGameStore(getSelectedItem)
    const { t } = useTranslations()

    if (qta <= 0) return <></>
    if (item === undefined) return

    return (
        <MyCard title={t[item.nameId]} icon={IconsData[item.icon]}>
            <ItemInfo item={item} />
            {item.equipSlot && <EquipItem />}
        </MyCard>
    )
})
export const EquipItem = memo(function EquipItem() {
    const selectedItemLocation = useGameStore(selectSelectedStdItemId)
    const selectedCraftedItemId = useGameStore(selectSelectedCraftedItemId)
    const item = useGameStore(getSelectedItem)

    const onClick = useCallback(() => {
        if (!item) return
        if (item.equipSlot) equipClick(PLAYER_ID, item.equipSlot, selectedItemLocation, selectedCraftedItemId, 1)
    }, [item, selectedItemLocation, selectedCraftedItemId])
    return (
        <>
            <Button onClick={onClick}>Equip</Button>
        </>
    )
})
