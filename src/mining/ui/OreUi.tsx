import { memo, useCallback } from 'react'
import { MyLabel } from '@/ui/myCard/MyLabel'
import { Card, CardContent } from '../../components/ui/card'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { useItemName } from '../../items/selectors/useItemName'
import { ItemIcon } from '../../items/ui/ItemIcon'
import { useTranslations } from '../../msg/useTranslations'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { RestartProgress } from '../../ui/progress/RestartProgress'
import { selectOreType } from '../../ui/state/uiSelectors'
import { selectDefaultMine, selectOre } from '../miningSelectors'
import { OreData } from '../OreData'
import { selectActiveVein } from '../selectors/selectActiveVein'

export const OreUi = memo(function OreUi() {
    const { f } = useNumberFormatter()
    const { t, fun } = useTranslations()
    const oreType = useGameStore(selectOreType)
    const oreQta = useGameStore(useCallback((state: GameState) => selectOre(state, oreType).qta, [oreType]))
    const activeVein = useGameStore(useCallback((state: GameState) => selectActiveVein(state, oreType), [oreType]))
    const def = useGameStore(useCallback((s) => selectDefaultMine(s, oreType), [oreType]))

    const oreData = OreData[oreType]
    const name = useItemName(oreData.oreId)
    const qta = activeVein?.qta ?? oreQta
    const maxQta = activeVein?.maxQta ?? def.qta
    const hpPercent = Math.floor((100 * qta) / Math.max(1, maxQta))

    return (
        <Card>
            <MyCardHeaderTitle title={fun.OreVein(name)} icon={<ItemIcon itemId={oreData.oreId} />} />
            <CardContent>
                <MyLabel>
                    {t.OreQta} {f(qta)}/{f(maxQta)}
                </MyLabel>
                <RestartProgress value={hpPercent} color="health" />
            </CardContent>
        </Card>
    )
})
