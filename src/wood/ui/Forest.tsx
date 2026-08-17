import { memoize } from 'proxy-memoize'
import { memo, useCallback, useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { MyLabel, MyLabelContainer } from '@/ui/myCard/MyLabel'
import { BonusDialog } from '../../bonus/ui/BonusUi'
import { Card, CardContent } from '../../components/ui/card'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { GameIcon } from '../../icons/GameIcon'
import { useTranslations } from '../../msg/useTranslations'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { ProgressBar } from '../../ui/progress/ProgressBar'
import { TimerProgressFromId } from '../../ui/progress/TimerProgress'
import { selectWoodType } from '../../ui/state/uiSelectors'
import { selectDefaultForest, selectForestQta, selectGrowingTreesMemo } from '../forest/forestSelectors'
import { selectTreeRespawnTime, selectTreeRespawnTimeAll } from '../forest/growSpeedSelectors'
import { MAX_GROWING_TREES } from '../WoodConst'
import { WoodData } from '../WoodData'
import { selectForestMaxTreeList } from '../forest/selectForestMaxTree'

export const Forest = memo(function Forest() {
    const woodType = useGameStore(selectWoodType)
    const { t } = useTranslations()
    const data = WoodData[woodType]

    return (
        <Card>
            <MyCardHeaderTitle
                title={t[`${woodType}Forest`]}
                icon={<GameIcon icon={data.iconId} className={data.color} />}
            />
            <CardContent>
                <ForestQta />

                <Trees />
            </CardContent>
        </Card>
    )
})

const ForestQta = memo(function ForestQta() {
    const woodType = useGameStore(selectWoodType)
    const location = useGameStore((s) => s.location)
    const qta = useGameStore(useCallback((s) => selectForestQta(s, woodType), [woodType]))
    const def = useGameStore(useShallow(useCallback((state) => selectDefaultForest(state, woodType), [woodType])))
    const { f } = useNumberFormatter()
    const { t } = useTranslations()
    const treePercent = Math.floor((100 * qta) / def.qta)
    const selectMaxTreeBonusMemo = useMemo(
        () => memoize((s: GameState) => selectForestMaxTreeList(s, woodType, location)),
        [location]
    )

    return (
        <>
            <MyLabelContainer>
                <MyLabel>
                    {t.Trees} {f(qta)} <span className="text-muted-foreground">/ {f(def.qta)}</span>
                    <BonusDialog title={t.maxTreeName} selectBonusResult={selectMaxTreeBonusMemo} />
                </MyLabel>
                <ForestRespawn />
            </MyLabelContainer>
            <ProgressBar value={treePercent} color="success" className="mb-2" />
        </>
    )
})

const ForestRespawn = memo(function ForestRespawn() {
    const woodType = useGameStore(selectWoodType)
    const location = useGameStore((s) => s.location)
    const { t, fun } = useTranslations()

    const respawn = useGameStore(useCallback((s) => selectTreeRespawnTime(s, woodType, location), [woodType, location]))
    const selectTreeRespawnTimeAllMemo = useMemo(
        () => memoize((s: GameState) => selectTreeRespawnTimeAll(s, woodType, location)),
        [woodType, location]
    )

    return (
        <MyLabel>
            {t.Time} {fun.formatTimePrecise(respawn)}
            <BonusDialog title={t.IncreaseGrowSpeed} selectBonusResult={selectTreeRespawnTimeAllMemo} isTime={true} />
        </MyLabel>
    )
})

const Trees = memo(function Trees() {
    const { f } = useNumberFormatter()
    const { t } = useTranslations()

    const woodType = useGameStore(selectWoodType)
    const trees = useGameStore(useShallow(selectGrowingTreesMemo(woodType)))

    return (
        <>
            <MyLabel>
                {t.GrowingTrees} {f(trees.length)}
                <span className="text-muted-foreground">/ {f(MAX_GROWING_TREES)}</span>
            </MyLabel>

            {trees.map((r) => (
                <Tree id={r} key={r} />
            ))}
        </>
    )
})

const Tree = memo(function Tree(props: { id: string }) {
    const { id } = props
    return <TimerProgressFromId timerId={id} color="success" className="mb-2" />
})
