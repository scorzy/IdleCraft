import { memo, useCallback } from 'react'
import { Card, CardContent, CardFooter } from '../components/ui/card'
import { useGameStore } from '../game/state'
import { getSelectedItemQta, getSelectedItem } from '../storage/StorageSelectors'
import { MyCardHeaderTitle } from '../ui/myCard/MyCard'
import { Button } from '../components/ui/button'
import { PLAYER_ID } from '../characters/charactersConst'
import { PotionDataUi } from '../items/ui/ItemInfo'
import { useTranslations } from '../msg/useTranslations'
import { consumePotionClick } from './alchemyFunctions'
import { PotionData } from './alchemyTypes'

export const PotionItemUi = memo(function PotionItemUi() {
    const qta = useGameStore(getSelectedItemQta)
    const item = useGameStore(getSelectedItem)

    if (qta <= 0) return
    if (!item) return
    if (!item.potionData) return

    return <PotionItemUiInt itemId={item.id} potionData={item.potionData} />
})
const PotionItemUiInt = memo(function PotionItemUiInt({
    itemId,
    potionData,
}: {
    itemId: string
    potionData: PotionData
}) {
    const { t } = useTranslations()
    const onClick = useCallback(() => {
        if (potionData) consumePotionClick(PLAYER_ID, itemId)
    }, [potionData, itemId])

    return (
        <Card>
            <MyCardHeaderTitle title={t.Potion} />
            <CardContent>
                <PotionDataUi potionData={potionData} />
            </CardContent>
            <CardFooter>
                <Button onClick={onClick}>{t.Use}</Button>
            </CardFooter>
        </Card>
    )
})
