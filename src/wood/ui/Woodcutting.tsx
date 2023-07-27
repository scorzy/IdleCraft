import { useGameStore } from '../../game/state'
import { selectWoodType } from '../../ui/state/uiSelectors'
import { WoodData } from '../WoodData'
import { useTranslations } from '../../msg/useTranslations'
import { Title } from '../../ui/Title'
import { Button } from '@mui/joy'
import { addWoodcutting } from '../WoodcuttingFunctions'
import { GameTimerProgress } from '../../ui/TimerProgress'
import { WoodTypes } from '../WoodTypes'
import { GameState } from '../../game/GameState'
import { selectForest, selectForestQta } from '../forest/forestSelectors'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { RestartProgress } from '../../ui/RestartProgress'
import { getWoodcuttingTime } from '../WoodcuttingSelectors'
import { ProgressBar } from '../../ui/ProgressBar'
import { selectDefaultForest } from '../forest/forestFunctions'
import { MyCardLabel, MyCardTitle } from '../../ui/myCard/myCard'

const selectWoodcutting = (woodType: WoodTypes) => (s: GameState) => {
    for (const id of s.woodcutting.ids) {
        const act = s.woodcutting.entries[id]
        if (act?.woodType === woodType) return act.activityId
    }
}

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

            <Button onClick={() => addWoodcutting(woodType)}>Cut</Button>
        </div>
    )
}
export function Forest() {
    const woodType = useGameStore(selectWoodType)
    const qta = useGameStore(selectForestQta(woodType))
    const def = selectDefaultForest(woodType)
    const { f } = useNumberFormatter()
    const treePercent = Math.floor((100 * qta) / def.qta)

    return (
        <div className="my-card">
            <MyCardTitle title={'Forest'} />

            <MyCardLabel>
                Trees{' '}
                <span className="monospace">
                    {f(qta)}/{f(def.qta)}
                </span>
            </MyCardLabel>
            <ProgressBar value={treePercent} color="success" />
        </div>
    )
}
