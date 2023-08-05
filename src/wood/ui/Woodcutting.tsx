import { useGameStore } from '../../game/state'
import { selectWoodType } from '../../ui/state/uiSelectors'
import { addWoodcutting } from '../WoodcuttingFunctions'
import { GameTimerProgress, TimerProgressFromId } from '../../ui/progress/TimerProgress'
import { WoodTypes } from '../WoodTypes'
import { GameState } from '../../game/GameState'
import { selectForest, selectForestQta, selectGrowingTrees, woodCuttingActId } from '../forest/forestSelectors'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { RestartProgress } from '../../ui/progress/RestartProgress'
import { getWoodcuttingTime } from '../WoodcuttingSelectors'
import { ProgressBar } from '../../ui/progress/ProgressBar'
import { selectDefaultForest } from '../forest/forestFunctions'
import { MyCard, MyCardLabel } from '../../ui/myCard/myCard'
import { memo, useCallback } from 'react'
import { removeActivity } from '../../activities/activityFunctions'
import { memoize } from '../../utils/memoize'
import { MyButton } from '../../ui/button/Button'

const selectWoodcutting = memoize((woodType: WoodTypes) => (s: GameState) => {
    for (const id of s.woodcutting.ids) {
        const act = s.woodcutting.entries[id]
        if (act?.woodType === woodType) return act.activityId
    }
})

export function Woodcutting() {
    const woodType = useGameStore(selectWoodType)

    return (
        <div className="my-parent-container">
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
        <MyCard title={'Cutting'} actions={<CuttingButton />}>
            <MyCardLabel>
                Tree HP{' '}
                <span className="monospace">
                    {f(forest.hp)}/{f(def.hp)}
                </span>
            </MyCardLabel>
            <RestartProgress value={hpPercent} className="mb" color="error" />
            <MyCardLabel>
                Time <span className="monospace">{ft(time)}</span>
            </MyCardLabel>
            <GameTimerProgress actionId={act} className="mb" color="primary" />
        </MyCard>
    )
}

const CuttingButton = memo(() => {
    const woodType = useGameStore(selectWoodType)
    const actId = useGameStore(woodCuttingActId(woodType))
    const onClickStart = useCallback(() => addWoodcutting(woodType), [woodType])
    const onClickRemove = useCallback(() => removeActivity(actId?.activityId), [actId])

    if (actId === undefined) return <MyButton onClick={onClickStart} text={'Cut'} variant="text" />

    return <MyButton onClick={onClickRemove} color="error" text={'Stop'} variant="text" />
})
CuttingButton.displayName = 'CuttingButton'

function Forest() {
    return (
        <MyCard title={'Forest'}>
            <ForestQta />
            <Trees />
        </MyCard>
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
