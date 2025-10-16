import { memo, useCallback } from 'react'
import { useGameStore } from '../../game/state'
import {
    getSelectedItem,
    getSelectedItemQta,
    isSelectedItemCurrentLocation,
    selectSelectedItemId,
} from '../../storage/StorageSelectors'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { Button } from '../../components/ui/button'
import { equipClick } from '../../characters/characterFunctions'
import { PLAYER_ID } from '../../characters/charactersConst'
import { Card, CardContent, CardFooter } from '../../components/ui/card'
import { useItemName } from '../useItemName'
import { ItemInfo } from './ItemInfo'
import classes from './selectItem.module.css'
import { ItemIcon } from './ItemIcon'

export const SelectedItem = memo(function SelectedItem({ showTitle }: { showTitle?: boolean }) {
    const qta = useGameStore(getSelectedItemQta)
    const item = useGameStore(getSelectedItem)
    const itemName = useItemName(item)

    if (qta <= 0) return
    if (item === undefined) return

    return (
        <div className="grid gap-3">
            {showTitle && (
                <Card>
                    <MyCardHeaderTitle title={itemName} icon={<ItemIcon itemId={item} />} />
                </Card>
            )}
            <SelectedItemInfo />
        </div>
    )
})
export const SelectedItemTitle = memo(function SelectedItemTitle() {
    const item = useGameStore(getSelectedItem)
    const itemName = useItemName(item)

    if (!item) return

    return <MyCardHeaderTitle title={itemName} icon={<ItemIcon itemId={item} />} />
})
export const SelectedItemInfo = memo(function SelectedItemInfo() {
    const qta = useGameStore(getSelectedItemQta)
    const item = useGameStore(getSelectedItem)
    const isCurrentLocation = useGameStore(isSelectedItemCurrentLocation)

    if (qta <= 0) return
    if (item === undefined) return

    return (
        <>
            <Card>
                <CardContent className={classes.container}>
                    <ItemInfo item={item} />
                </CardContent>
            </Card>
            {isCurrentLocation && item.equipSlot && <EquipItem />}
        </>
    )
})
const EquipItem = memo(function EquipItem() {
    const selectedItemId = useGameStore(selectSelectedItemId)
    const item = useGameStore(getSelectedItem)

    const onClick = useCallback(() => {
        if (!item) return
        if (item.equipSlot) equipClick(PLAYER_ID, item.equipSlot, selectedItemId, 1)
    }, [item, selectedItemId])

    if (!item) return

    return (
        <Card>
            <MyCardHeaderTitle title={`Equip ${item.equipSlot}`} />
            <CardFooter>
                <Button onClick={onClick}>Equip</Button>
            </CardFooter>
        </Card>
    )
})
