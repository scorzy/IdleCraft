import { memo, useCallback } from 'react'
import { GiMining } from 'react-icons/gi'
import { useGameStore } from '../../game/state'
import { selectOreType } from '../../ui/state/uiSelectors'
import { MyCard, MyCardLabel } from '../../ui/myCard/myCard'
import { getMiningTime, selectDefaultMine, selectMining, selectOre } from '../miningSelectors'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { useTranslations } from '../../msg/useTranslations'
import { Button } from '../../components/ui/button'
import { RestartProgress } from '../../ui/progress/RestartProgress'
import { GameTimerProgress } from '../../ui/progress/TimerProgress'
import { OreData } from '../OreData'
import { ExperienceCard } from '../../experience/ui/ExperienceCard'
import { ExpEnum } from '../../experience/expEnum'
import { EquipItemUi } from '../../items/ui/EquipSelect'
import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
import { MyPage } from '../../ui/pages/MyPage'
import { addMining } from '../functions/addMining'
import { removeActivity } from '../../activities/functions/removeActivity'
import classes from './mining.module.css'
import { MiningSidebar } from './MiningSidebar'

export const Mining = memo(function Mining() {
    const oreType = useGameStore(selectOreType)
    return (
        <MyPage>
            <div className="page__info">
                <ExperienceCard expType={ExpEnum.Mining} />
                <EquipItemUi slot={EquipSlotsEnum.Pickaxe} />
            </div>
            <div className="page__main" key={oreType}>
                <MiningSidebar />
                <MiningOre />
                <OreUi />
            </div>
        </MyPage>
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
    const time = useGameStore(getMiningTime)
    const oreData = OreData[oreType]

    return (
        <MyCard title={t.Mining} actions={<MiningButton />} icon={<GiMining />}>
            <MyCardLabel>
                <span className={classes.oreHp}>
                    {t.OreHp} {f(ore.hp)}/{f(def.hp)}
                </span>
                <span>Armour {f(oreData.armour)}</span>
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
