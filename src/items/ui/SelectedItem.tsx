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
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { Button } from '../../components/ui/button'
import { equipClick } from '../../characters/characterFunctions'
import { PLAYER_ID } from '../../characters/charactersConst'
import { Card, CardContent } from '../../components/ui/card'
import { ItemInfo } from './ItemInfo'
import classes from './selectItem.module.css'

export const SelectedItem = memo(function SelectedItem() {
    const qta = useGameStore(getSelectedItemQta)
    const item = useGameStore(getSelectedItem)
    const { t } = useTranslations()

    if (qta <= 0) return
    if (item === undefined) return

    return (
        <Card>
            <MyCardHeaderTitle title={t[item.nameId]} icon={IconsData[item.icon]} />
            <CardContent className={classes.container}>
                <ItemInfo item={item} />
                {item.equipSlot && <EquipItem />}
            </CardContent>
        </Card>
    )
})
const EquipItem = memo(function EquipItem() {
    const selectedStdItem = useGameStore(selectSelectedStdItemId)
    const selectedCraftedItemId = useGameStore(selectSelectedCraftedItemId)
    const item = useGameStore(getSelectedItem)

    const onClick = useCallback(() => {
        if (!item) return
        if (item.equipSlot) equipClick(PLAYER_ID, item.equipSlot, selectedStdItem, selectedCraftedItemId, 1)
    }, [item, selectedStdItem, selectedCraftedItemId])
    return <Button onClick={onClick}>Equip</Button>
})
