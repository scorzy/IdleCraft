import { memo, useCallback } from 'react'
import { GiWoodAxe } from 'react-icons/gi'
import { useGameStore } from '../../game/state'
import { selectWoodType } from '../../ui/state/uiSelectors'
import { addWoodcutting } from '../WoodcuttingFunctions'
import { GameTimerProgress, TimerProgressFromId } from '../../ui/progress/TimerProgress'
import { WoodTypes } from '../WoodTypes'
import { GameState } from '../../game/GameState'
import {
    selectDefaultForest,
    selectForest,
    selectForestQta,
    selectGrowingTrees,
    woodCuttingActId,
} from '../forest/forestSelectors'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { RestartProgress } from '../../ui/progress/RestartProgress'
import {
    selectWoodcuttingDamage,
    selectWoodcuttingDamageAll,
    selectWoodcuttingTime,
    selectWoodcuttingTimeAll,
} from '../selectors/WoodcuttingSelectors'
import { ProgressBar } from '../../ui/progress/ProgressBar'
import { MyCard, MyCardLabel } from '../../ui/myCard/myCard'
import { removeActivity } from '../../activities/activityFunctions'
import { memoize } from '../../utils/memoize'
import { useTranslations } from '../../msg/useTranslations'
import { WoodData } from '../WoodData'
import { ExperienceCard } from '../../experience/ui/ExperienceCard'
import { ExpEnum } from '../../experience/expEnum'
import { EquipItemUi } from '../../items/ui/EquipSelect'
import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
import { BonusDialog, BonusSpan } from '../../bonus/ui/BonusUi'
import { MyPage } from '../../ui/pages/MyPage'
import { WoodcuttingSidebar } from './WoodcuttingSidebar'
import { Button } from '@/components/ui/button'

const selectWoodcutting = memoize((woodType: WoodTypes) => (s: GameState) => {
    for (const id of s.woodcutting.ids) {
        const act = s.woodcutting.entries[id]
        if (act?.woodType === woodType) return act.activityId
    }
})

export const Woodcutting = memo(function Woodcutting() {
    const woodType = useGameStore(selectWoodType)
    return (
        <MyPage>
            <div className="page__info">
                <ExperienceCard expType={ExpEnum.Woodcutting} />
                <EquipItemUi slot={EquipSlotsEnum.WoodAxe} />
            </div>
            <div className="page__main" key={woodType}>
                <MyCard title="Forests">
                    <WoodcuttingSidebar />
                </MyCard>
                <Cutting />
                <Forest />
            </div>
        </MyPage>
    )
})

const Cutting = memo(function Cutting() {
    const woodType = useGameStore(selectWoodType)
    const forest = useGameStore(selectForest(woodType))
    const act = useGameStore(selectWoodcutting(woodType))
    const { f, ft } = useNumberFormatter()
    const { t, fun } = useTranslations()
    const def = selectDefaultForest(woodType)
    const hpPercent = Math.floor((100 * forest.hp) / def.hp)
    const time = useGameStore(selectWoodcuttingTime)
    const damage = useGameStore(selectWoodcuttingDamage)
    const damageBonusRes = useGameStore(selectWoodcuttingDamageAll)
    const timeBonusRes = useGameStore(selectWoodcuttingTimeAll)

    return (
        <MyCard title={fun.cutting(woodType)} actions={<CuttingButton />} icon={<GiWoodAxe />}>
            <MyCardLabel>
                <span>
                    {t.TreeHP} {f(forest.hp)}/{f(def.hp)}
                </span>
            </MyCardLabel>
            <BonusSpan>
                {t.Damage} {f(damage)}
                <BonusDialog title={t.WoodcuttingDamage} bonusResult={damageBonusRes} />
            </BonusSpan>
            <RestartProgress value={hpPercent} color="error" className="mb-2" />
            <BonusSpan>
                {t.Time} {ft(time)}
                <BonusDialog title={t.WoodcuttingTime} bonusResult={timeBonusRes} isTime={true} />
            </BonusSpan>
            <GameTimerProgress actionId={act} color="primary" />
        </MyCard>
    )
})

const CuttingButton = memo(function CuttingButton() {
    const woodType = useGameStore(selectWoodType)
    const actId = useGameStore(woodCuttingActId(woodType))
    const onClickStart = useCallback(() => addWoodcutting(woodType), [woodType])
    const onClickRemove = useCallback(() => removeActivity(actId?.activityId), [actId])
    const { t } = useTranslations()

    if (actId === undefined) return <Button onClick={onClickStart}>{t.Cut}</Button>

    return (
        <Button onClick={onClickRemove} variant="destructive">
            {t.Stop}
        </Button>
    )
})

const Forest = memo(function Forest() {
    const woodType = useGameStore(selectWoodType)
    const { t } = useTranslations()
    const data = WoodData[woodType]

    return (
        <MyCard title={t[`${woodType}Forest`]} icon={data.icon}>
            <ForestQta />
            <Trees />
        </MyCard>
    )
})

const ForestQta = memo(function ForestQta() {
    const woodType = useGameStore(selectWoodType)
    const qta = useGameStore(selectForestQta(woodType))
    const def = selectDefaultForest(woodType)
    const { f } = useNumberFormatter()
    const { t } = useTranslations()
    const treePercent = Math.floor((100 * qta) / def.qta)

    return (
        <>
            <MyCardLabel>
                {t.Trees} {f(qta)}/{f(def.qta)}
            </MyCardLabel>
            <ProgressBar value={treePercent} color="success" className="mb-2" />
        </>
    )
})

const Trees = memo(function Trees() {
    const woodType = useGameStore(selectWoodType)
    const trees = useGameStore(selectGrowingTrees(woodType))
    const { f } = useNumberFormatter()
    const { t } = useTranslations()
    return (
        <>
            <MyCardLabel>
                {t.GrowingTrees} {f(trees.length)}
            </MyCardLabel>

            {trees.map((t) => (
                <Tree id={t} key={t} />
            ))}
        </>
    )
})

const Tree = memo(function Tree(props: { id: string }) {
    const { id } = props
    return <TimerProgressFromId timerId={id} color="success" className="mb-2" />
})
