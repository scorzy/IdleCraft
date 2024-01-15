import { memo, useCallback } from 'react'
import { GiMining } from 'react-icons/gi'
import { useGameStore } from '../../game/state'
import { selectOreType } from '../../ui/state/uiSelectors'
import { MyCard } from '../../ui/myCard/MyCard'
import { selectDefaultMine, selectMining, selectOre } from '../miningSelectors'
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
import { MyPage, MyPageAll } from '../../ui/pages/MyPage'
import { addMining } from '../functions/addMining'
import { removeActivity } from '../../activities/functions/removeActivity'
import { IconsData } from '../../icons/Icons'
import { selectMiningTime, selectMiningTimeAll } from '../selectors/miningTime'
import { BonusDialog } from '../../bonus/ui/BonusUi'
import { selectMiningDamage, selectMiningDamageAll } from '../selectors/miningDamage'
import classes from './mining.module.css'
import { MiningSidebar } from './MiningSidebar'
import { MyLabel } from '@/ui/myCard/MyLabel'

export const Mining = memo(function Mining() {
    const oreType = useGameStore(selectOreType)
    return (
        <MyPageAll
            sidebar={<MiningSidebar />}
            header={
                <div className="page__info">
                    <ExperienceCard expType={ExpEnum.Mining} />
                    <EquipItemUi slot={EquipSlotsEnum.Pickaxe} />
                </div>
            }
        >
            <MyPage className="page__main" key={oreType}>
                <MiningOre />
                <OreUi />
            </MyPage>
        </MyPageAll>
    )
})

const MiningOre = memo(function MiningOre() {
    const oreType = useGameStore(selectOreType)
    const ore = useGameStore(selectOre(oreType))
    const act = useGameStore(selectMining(oreType))
    const damage = useGameStore(selectMiningDamage)
    const { f, ft } = useNumberFormatter()
    const { t } = useTranslations()
    const def = selectDefaultMine(oreType)
    const hpPercent = Math.floor((100 * ore.hp) / def.hp)
    const time = useGameStore(selectMiningTime)
    const oreData = OreData[oreType]

    return (
        <MyCard title={t.Mining} actions={<MiningButton />} icon={<GiMining />}>
            <MyLabel className="text-muted-foreground">
                <span className={classes.oreHp}>
                    {t.OreHp} {f(ore.hp)}/{f(def.hp)}
                </span>
                <span>
                    {t.Armour} {f(oreData.armour)}
                </span>
            </MyLabel>
            <MyLabel className="text-muted-foreground">
                <span>
                    {t.Damage} {f(damage)}
                </span>
                <BonusDialog title={t.MiningDamage} selectBonusResult={selectMiningDamageAll} />
            </MyLabel>
            <RestartProgress value={hpPercent} color="health" className="mb-2" />
            <MyLabel className="text-muted-foreground">
                {t.Time} {ft(time)}
                <BonusDialog title={t.MiningTime} selectBonusResult={selectMiningTimeAll} isTime={true} />
            </MyLabel>
            <GameTimerProgress actionId={act} color="primary" className="mb-2" />
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
        <MyCard title={t.OreVein} icon={IconsData[oreData.iconId]}>
            <MyLabel className="text-muted-foreground">
                {t.OreQta} {f(ore.qta)}/{f(def.qta)}
            </MyLabel>
            <RestartProgress value={hpPercent} color="health" />
        </MyCard>
    )
})
