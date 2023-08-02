import { useGameStore } from '../../game/state'
import { selectWoodType } from '../../ui/state/uiSelectors'
import { WoodData } from '../WoodData'
import { useTranslations } from '../../msg/useTranslations'
import { Title } from '../../ui/Title'
import { Button } from '@mui/joy'
import { addWoodcutting } from '../WoodcuttingFunctions'
import { GameTimerProgress, TimerProgressFromId } from '../../ui/TimerProgress'
import { WoodTypes } from '../WoodTypes'
import { GameState } from '../../game/GameState'
import { selectForest, selectForestQta, selectGrowingTrees, woodCuttingActId } from '../forest/forestSelectors'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { RestartProgress } from '../../ui/RestartProgress'
import { getWoodcuttingTime } from '../WoodcuttingSelectors'
import { ProgressBar } from '../../ui/ProgressBar'
import { selectDefaultForest } from '../forest/forestFunctions'
import { MyCardLabel, MyCardTitle } from '../../ui/myCard/myCard'
import { memo, useCallback } from 'react'
import { removeActivity } from '../../activities/activityFunctions'
import { memoize } from '../../utils/memoize'

const selectWoodcutting = memoize((woodType: WoodTypes) => (s: GameState) => {
    for (const id of s.woodcutting.ids) {
        const act = s.woodcutting.entries[id]
        if (act?.woodType === woodType) return act.activityId
    }
})

export function Woodcutting() {
    const woodType = useGameStore(selectWoodType)
    const data = WoodData[woodType]
    const t = useTranslations()
    return (
        <div className="my-parent-container">
            <Title icon={data.icon} text={data.getName(t)} />
            <div className="my-container" key={woodType}>
                <Cutting />
                <Forest />
            </div>
        </div>
    )
}
export function Cutting() {
    const woodType = useGameStore(selectWoodType)
    const forest = useGameStore(selectForest(woodType))
    const act = useGameStore(selectWoodcutting(woodType))
    const { f, ft } = useNumberFormatter()
    const def = selectDefaultForest(woodType)
    const hpPercent = Math.floor((100 * forest.hp) / def.hp)
    const time = getWoodcuttingTime()

    return (
        <div className="my-card">
            <MyCardTitle title={'Cutting'} />

            <MyCardLabel>
                Tree HP{' '}
                <span className="monospace">
                    {f(forest.hp)}/{f(def.hp)}
                </span>
            </MyCardLabel>
            <RestartProgress value={hpPercent} className="mb" color="danger" />

            <MyCardLabel>
                Time <span className="monospace">{ft(time)}</span>
            </MyCardLabel>
            <GameTimerProgress actionId={act} className="mb" color="primary" />

            <CuttingButton />
        </div>
    )
}

const CuttingButton = memo(() => {
    const woodType = useGameStore(selectWoodType)
    const actId = useGameStore(woodCuttingActId(woodType))
    const onClickStart = useCallback(() => addWoodcutting(woodType), [woodType])
    const onClickRemove = useCallback(() => removeActivity(actId?.activityId), [actId])

    if (actId === undefined) return <Button onClick={onClickStart}>Cut</Button>

    return (
        <Button onClick={onClickRemove} color="danger">
            Stop
        </Button>
    )
})
CuttingButton.displayName = 'CuttingButton'

function Forest() {
    return (
        <div className="my-card">
            <MyCardTitle title={'Forest'} />
            <ForestQta />
            <Trees />
        </div>
    )
}

function ForestQta() {
    const woodType = useGameStore(selectWoodType)
    const qta = useGameStore(selectForestQta(woodType))
    const def = selectDefaultForest(woodType)
    const { f } = useNumberFormatter()
    const treePercent = Math.floor((100 * qta) / def.qta)

    return (
        <>
            <MyCardLabel>
                Trees{' '}
                <span className="monospace">
                    {f(qta)}/{f(def.qta)}
                </span>
            </MyCardLabel>
            <ProgressBar value={treePercent} color="success" className="mb" />
        </>
    )
}

const Trees = memo(() => {
    const woodType = useGameStore(selectWoodType)
    const trees = useGameStore(selectGrowingTrees(woodType))
    const { f } = useNumberFormatter()
    return (
        <>
            <MyCardLabel>
                Growing Trees: <span className="monospace">{f(trees.length)}</span>
            </MyCardLabel>

            {trees.map((t) => (
                <Tree id={t} key={t} />
            ))}
        </>
    )
})
Trees.displayName = 'Trees'

const Tree = memo((props: { id: string }) => {
    const { id } = props

    return <TimerProgressFromId timerId={id} color="success" className="mb" />
})
Tree.displayName = 'Tree'
