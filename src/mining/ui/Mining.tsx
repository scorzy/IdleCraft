import { memo, useCallback } from 'react'
import { PageWithSidebar } from '../../ui/shell/AppShell'
import { MiningSidebar } from './MiningSidebar'
import { useGameStore } from '../../game/state'
import { selectOreType } from '../../ui/state/uiSelectors'
import { MyCard, MyCardLabel } from '../../ui/myCard/myCard'
import { GiMining } from 'react-icons/gi'
import { getMiningTime, selectDefaultMine, selectMining, selectOre } from '../miningSelectors'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { useTranslations } from '../../msg/useTranslations'
import { removeActivity } from '../../activities/activityFunctions'
import { Button } from '../../components/ui/button'
import { RestartProgress } from '../../ui/progress/RestartProgress'
import { GameTimerProgress } from '../../ui/progress/TimerProgress'
import { addMining } from '../addMining'
import { OreData } from '../OreData'

export const Mining = memo(function Mining() {
    return (
        <PageWithSidebar sidebar={<MiningSidebar />}>
            <MiningContainer />
        </PageWithSidebar>
    )
})
export const MiningContainer = memo(function MiningContainer() {
    const oreType = useGameStore(selectOreType)
    return (
        <div className="my-container" key={oreType}>
            <MiningOre />
            <OreUi />
        </div>
    )
})
const MiningOre = memo(function MiningOre() {
    const oreType = useGameStore(selectOreType)
    const ore = useGameStore(selectOre(oreType))
    const act = useGameStore(selectMining(oreType))
    const { f, ft } = useNumberFormatter()
    const { t } = useTranslations()
    const def = selectDefaultMine(oreType)
    const hpPercent = Math.floor((100 * ore.hp) / def.hp)
    const time = getMiningTime()

    return (
        <MyCard title={t.Mining} actions={<MiningButton />} icon={<GiMining />}>
            <MyCardLabel>
                {t.OreHp} {f(ore.hp)}/{f(def.hp)}
            </MyCardLabel>
            <RestartProgress value={hpPercent} color="error" />
            <MyCardLabel>
                {t.Time} {ft(time)}
            </MyCardLabel>
            <GameTimerProgress actionId={act} color="primary" />
        </MyCard>
    )
})

const MiningButton = memo(function CuttingButton() {
    const oreType = useGameStore(selectOreType)
    const act = useGameStore(selectMining(oreType))
    const onClickStart = useCallback(() => addMining(oreType), [oreType])
    const onClickRemove = useCallback(() => removeActivity(act), [act])
    const { t } = useTranslations()

    if (act === undefined) return <Button onClick={onClickStart}>{t.Mine}</Button>

    return (
        <Button onClick={onClickRemove} variant="destructive">
            {t.Stop}
        </Button>
    )
})
const OreUi = memo(function MiningOre() {
    const oreType = useGameStore(selectOreType)
    const oreData = OreData[oreType]
    const ore = useGameStore(selectOre(oreType))
    const { f } = useNumberFormatter()
    const { t } = useTranslations()
    const def = selectDefaultMine(oreType)
    const hpPercent = Math.floor((100 * ore.qta) / def.qta)

    return (
        <MyCard title={t.OreVein} icon={oreData.icon}>
            <MyCardLabel>
                {t.OreQta} {f(ore.qta)}/{f(def.qta)}
            </MyCardLabel>
            <RestartProgress value={hpPercent} color="info" />
        </MyCard>
    )
})
