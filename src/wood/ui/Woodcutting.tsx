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
import { getWoodcuttingTime } from '../WoodcuttingSelectors'
import { ProgressBar } from '../../ui/progress/ProgressBar'
import { MyCard, MyCardLabel } from '../../ui/myCard/myCard'
import { memo, useCallback } from 'react'
import { removeActivity } from '../../activities/activityFunctions'
import { memoize } from '../../utils/memoize'
import { PageWithSidebar } from '../../ui/shell/AppShell'
import { WoodcuttingSidebar } from './WoodcuttingSidebar'
import { useTranslations } from '../../msg/useTranslations'
import { WoodData } from '../WoodData'
import { GiWoodAxe } from 'react-icons/gi'
import { Button } from '@/components/ui/button'
import { ExperienceCard } from '../../experience/ui/ExperienceCard'
import { ExpEnum } from '../../experience/expEnum'
import { EquipItemUi } from '../../items/ui/EquipSelect'
import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'

const selectWoodcutting = memoize((woodType: WoodTypes) => (s: GameState) => {
    for (const id of s.woodcutting.ids) {
        const act = s.woodcutting.entries[id]
        if (act?.woodType === woodType) return act.activityId
    }
})

export const Woodcutting = memo(function Woodcutting() {
    return (
        <PageWithSidebar sidebar={<WoodcuttingSidebar />}>
            <WoodcuttingContainer />
        </PageWithSidebar>
    )
})

const WoodcuttingContainer = memo(function WoodcuttingContainer() {
    const woodType = useGameStore(selectWoodType)
    return (
        <div className="page-container">
            <div className="my-container">
                <ExperienceCard expType={ExpEnum.Woodcutting} />
                <EquipItemUi slot={EquipSlotsEnum.WoodAxe} />
            </div>
            <div className="my-container" key={woodType}>
                <Cutting />
                <Forest />
            </div>
        </div>
    )
})

const Cutting = memo(function Cutting() {
    const woodType = useGameStore(selectWoodType)
    const forest = useGameStore(selectForest(woodType))
    const act = useGameStore(selectWoodcutting(woodType))
    const { f, ft } = useNumberFormatter()
    const { t } = useTranslations()
    const def = selectDefaultForest(woodType)
    const hpPercent = Math.floor((100 * forest.hp) / def.hp)
    const time = useGameStore(getWoodcuttingTime)

    return (
        <MyCard title={t.Cutting} actions={<CuttingButton />} icon={<GiWoodAxe />}>
            <MyCardLabel>
                {t.TreeHP} {f(forest.hp)}/{f(def.hp)}
            </MyCardLabel>
            <RestartProgress value={hpPercent} color="error" />
            <MyCardLabel>
                {t.Time} {ft(time)}
            </MyCardLabel>
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
            <ProgressBar value={treePercent} color="success" className="mb" />
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

    return <TimerProgressFromId timerId={id} color="success" />
})
