import { memo, useCallback } from 'react'
import { TbAlertTriangle } from 'react-icons/tb'
import { useGameStore } from '../../game/state'
import { selectWoodType } from '../../ui/state/uiSelectors'
import { addWoodcutting } from '../functions/addWoodcutting'
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
import { ProgressBar } from '../../ui/progress/ProgressBar'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { myMemoize } from '../../utils/myMemoize'
import { useTranslations } from '../../msg/useTranslations'
import { WoodData } from '../WoodData'
import { ExperienceCard } from '../../experience/ui/ExperienceCard'
import { ExpEnum } from '@/experience/ExpEnum.1'
import { EquipItemUi } from '../../items/ui/EquipSelect'
import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
import { BonusDialog } from '../../bonus/ui/BonusUi'
import { MyPage, MyPageAll } from '../../ui/pages/MyPage'
import { removeActivity } from '../../activities/functions/removeActivity'
import { IconsData } from '../../icons/Icons'
import { selectWoodcuttingDamage, selectWoodcuttingDamageAll } from '../selectors/woodcuttingDamage'
import { selectWoodcuttingTime, selectWoodcuttingTimeAll } from '../selectors/woodcuttingTime'
import { Alert, AlertTitle, AlertDescription } from '../../components/ui/alert'
import { isSelectedWoodEnabled } from '../selectors/WoodcuttingSelectors'
import { Card, CardContent, CardFooter } from '../../components/ui/card'
import { PLAYER_ID } from '../../characters/charactersConst'
import { isWoodcutting } from '../Woodcutting'
import { WoodcuttingSidebar } from './WoodcuttingSidebar'
import { MyLabel, MyLabelContainer } from '@/ui/myCard/MyLabel'
import { Button } from '@/components/ui/button'

const selectWoodcutting = myMemoize((woodType: WoodTypes) => (s: GameState) => {
    for (const id of s.activities.ids) {
        const act = s.activities.entries[id]
        if (act && isWoodcutting(act) && act?.woodType === woodType) return act.id
    }
})

export const Woodcutting = memo(function Woodcutting() {
    const woodType = useGameStore(selectWoodType)
    return (
        <MyPageAll
            key={woodType}
            sidebar={<WoodcuttingSidebar />}
            info={
                <div className="page__info">
                    <ExperienceCard expType={ExpEnum.Woodcutting} charId={PLAYER_ID} />
                    <EquipItemUi slot={EquipSlotsEnum.WoodAxe} />
                </div>
            }
        >
            <MyPage className="page__main">
                <WoodPage />
            </MyPage>
        </MyPageAll>
    )
})

const WoodPage = memo(function WoodPage() {
    const { f } = useNumberFormatter()
    const { t, fun } = useTranslations()
    const woodType = useGameStore(selectWoodType)
    const enabled = useGameStore(isSelectedWoodEnabled)

    const data = WoodData[woodType]

    if (!enabled)
        return (
            <Alert variant="destructive">
                <TbAlertTriangle className="h-4 w-4" />
                <AlertTitle>{t.LevelToLow}</AlertTitle>
                <AlertDescription>{fun.requireWoodcuttingLevel(f(data.requiredLevel))}</AlertDescription>
            </Alert>
        )

    return (
        <>
            <Cutting />
            <Forest />
        </>
    )
})

const Cutting = memo(function Cutting() {
    const woodType = useGameStore(selectWoodType)
    const forest = useGameStore(selectForest(woodType))
    const act = useGameStore(selectWoodcutting(woodType))
    const { f } = useNumberFormatter()
    const { t, fun } = useTranslations()
    const def = selectDefaultForest(woodType)
    const hpPercent = Math.floor((100 * forest.hp) / def.hp)
    const time = useGameStore(selectWoodcuttingTime)
    const damage = useGameStore(selectWoodcuttingDamage)

    return (
        <Card>
            <MyCardHeaderTitle title={fun.cutting(woodType)} icon={IconsData.Axe} />
            <CardContent>
                <MyLabelContainer>
                    <MyLabel>
                        <span>
                            {t.TreeHP} {f(forest.hp)}
                        </span>
                        <span className="text-muted-foreground">/ {f(def.hp)}</span>
                    </MyLabel>
                    <MyLabel>
                        {t.Damage} {f(damage)}
                        <BonusDialog title={t.WoodcuttingDamage} selectBonusResult={selectWoodcuttingDamageAll} />
                    </MyLabel>
                </MyLabelContainer>
                <RestartProgress value={hpPercent} color="health" className="mb-2" />
                <MyLabel>
                    {t.Time} {fun.formatTime(time)}
                    <BonusDialog title={t.WoodcuttingTime} selectBonusResult={selectWoodcuttingTimeAll} isTime={true} />
                </MyLabel>
                <GameTimerProgress actionId={act} color="primary" className="mb-2" />
            </CardContent>
            <CardFooter>
                <CuttingButton />
            </CardFooter>
        </Card>
    )
})

const CuttingButton = memo(function CuttingButton() {
    const woodType = useGameStore(selectWoodType)
    const actId = useGameStore(woodCuttingActId(woodType))
    const onClickStart = useCallback(() => addWoodcutting(woodType), [woodType])
    const onClickRemove = useCallback(() => removeActivity(actId?.id), [actId])
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
        <Card>
            <MyCardHeaderTitle title={t[`${woodType}Forest`]} icon={IconsData[data.iconId]} />
            <CardContent>
                <ForestQta />
                <Trees />
            </CardContent>
        </Card>
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
            <MyLabel>
                {t.Trees} {f(qta)} <span className="text-muted-foreground">/ {f(def.qta)}</span>
            </MyLabel>
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
            <MyLabel>
                {t.GrowingTrees} {f(trees.length)}
            </MyLabel>

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
