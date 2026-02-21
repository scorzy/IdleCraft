import { memo, useCallback, useMemo } from 'react'
import { TbAlertTriangle } from 'react-icons/tb'
import { useShallow } from 'zustand/react/shallow'
import { memoize } from 'proxy-memoize'
import { useGameStore } from '../../game/state'
import { selectWoodType } from '../../ui/state/uiSelectors'
import { addWoodcutting } from '../functions/addWoodcutting'
import { GameTimerProgress, TimerProgressFromId } from '../../ui/progress/TimerProgress'
import { GameState } from '../../game/GameState'
import { selectDefaultForest, selectForest, selectForestQta, selectGrowingTreesMemo } from '../forest/forestSelectors'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { RestartProgress } from '../../ui/progress/RestartProgress'
import { ProgressBar } from '../../ui/progress/ProgressBar'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { useTranslations } from '../../msg/useTranslations'
import { WoodData } from '../WoodData'
import { ExperienceCard } from '../../experience/ui/ExperienceCard'
import { EquipItemUi } from '../../items/ui/EquipSelect'
import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
import { BonusDialog } from '../../bonus/ui/BonusUi'
import { MyPage, MyPageAll } from '../../ui/pages/MyPage'
import { removeActivity } from '../../activities/functions/removeActivity'
import { IconsData } from '../../icons/Icons'
import { selectWoodcuttingDamage, selectWoodcuttingDamageAll } from '../selectors/woodcuttingDamage'
import { addIncreaseGrowSpeed } from '../functions/addIncreaseGrowSpeed'
import { selectWoodcuttingTime, selectWoodcuttingTimeAll } from '../selectors/woodcuttingTime'
import { Alert, AlertTitle, AlertDescription } from '../../components/ui/alert'
import {
    isSelectedWoodEnabled,
    selectIncreaseGrowSpeedId,
    selectWoodcuttingId,
} from '../selectors/WoodcuttingSelectors'
import { Card, CardContent, CardFooter } from '../../components/ui/card'
import { PLAYER_ID } from '../../characters/charactersConst'
import { MAX_GROWING_TREES } from '../WoodConst'
import {
    selectIncreaseGrowSpeedActiveCount,
    selectIncreaseGrowSpeedBonusAll,
    selectIncreaseGrowSpeedCap,
    selectGrowSpeedBonusMulti,
    selectTreeRespawnTime,
    selectTreeRespawnTimeAll,
} from '../forest/growSpeedSelectors'
import { GameIcon } from '../../icons/GameIcon'
import { AddActivityDialog } from '../../activities/ui/AddActivityDialog'
import { WoodcuttingSidebar } from './WoodcuttingSidebar'
import { ExpEnum } from '@/experience/ExpEnum'
import { MyLabel, MyLabelContainer } from '@/ui/myCard/MyLabel'
import { Button } from '@/components/ui/button'

export const Woodcutting = memo(function Woodcutting() {
    const woodType = useGameStore(selectWoodType)
    return (
        <MyPageAll
            key={woodType}
            sidebar={<WoodcuttingSidebar />}
            header={
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
    const { f } = useNumberFormatter()
    const { t, fun } = useTranslations()

    const woodType = useGameStore(selectWoodType)
    const selectForestMemo = useMemo(() => memoize((s: GameState) => selectForest(s, woodType)), [woodType])
    const forest = useGameStore(selectForestMemo)
    const act = useGameStore(useCallback((s) => selectWoodcuttingId(s, woodType), [woodType]))
    const defHp = useGameStore(useShallow(useCallback((state) => selectDefaultForest(state, woodType).hp, [woodType])))
    const hpPercent = Math.floor((100 * forest.hp) / defHp)
    const time = useGameStore(selectWoodcuttingTime)
    const damage = useGameStore(selectWoodcuttingDamage)
    const location = useGameStore((s) => s.location)
    const activeBoost = useGameStore(
        useCallback((s) => selectGrowSpeedBonusMulti(s, woodType, location), [woodType, location])
    )
    const activeStacks = useGameStore(
        useCallback((s) => selectIncreaseGrowSpeedActiveCount(s, woodType, location), [woodType, location])
    )
    const maxStacks = useGameStore(selectIncreaseGrowSpeedCap)
    const selectGrowSpeedBonusAllMemo = useMemo(
        () => memoize((s: GameState) => selectIncreaseGrowSpeedBonusAll(s, woodType, location)),
        [woodType, location]
    )

    return (
        <Card>
            <MyCardHeaderTitle title={fun.cutting(woodType)} icon={IconsData.Axe} />
            <CardContent>
                <MyLabelContainer>
                    <MyLabel>
                        <span>
                            {t.TreeHP} {f(forest.hp)}
                        </span>
                        <span className="text-muted-foreground">/ {f(defHp)}</span>
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
                <MyLabel>
                    {t.IncreaseGrowSpeed} +{f(activeBoost)}% ({f(activeStacks)}/{f(maxStacks)})
                    <BonusDialog title={t.IncreaseGrowSpeed} selectBonusResult={selectGrowSpeedBonusAllMemo} />
                </MyLabel>
                <GameTimerProgress actionId={act} color="primary" className="mb-2" />
                <GrowSpeedProgress />
            </CardContent>
            <CardFooter className="flex gap-2">
                <CuttingButton />
                <GrowSpeedButton />
            </CardFooter>
        </Card>
    )
})

const CuttingButton = memo(function CuttingButton() {
    const woodType = useGameStore(selectWoodType)
    const actId = useGameStore(useCallback((s) => selectWoodcuttingId(s, woodType), [woodType]))
    const onClickStart = useCallback(() => addWoodcutting(woodType), [woodType])
    const onClickRemove = useCallback(() => removeActivity(actId), [actId])
    const { t, fun } = useTranslations()

    if (actId)
        return (
            <Button onClick={onClickRemove} variant="destructive">
                {t.Stop}
            </Button>
        )

    return (
        <AddActivityDialog
            addBtn={<Button onClick={onClickStart}>{t.Cut}</Button>}
            title={
                <>
                    {IconsData.Axe} {fun.cutting(woodType)}
                </>
            }
            openBtn={<Button>{t.Cut}</Button>}
        />
    )
})

const GrowSpeedButton = memo(function GrowSpeedButton() {
    const { t } = useTranslations()
    const woodType = useGameStore(selectWoodType)
    const location = useGameStore((s) => s.location)
    const actId = useGameStore(
        useCallback((s) => selectIncreaseGrowSpeedId(s, woodType, location), [woodType, location])
    )
    const active = useGameStore(
        useCallback((s) => selectIncreaseGrowSpeedActiveCount(s, woodType, location), [woodType, location])
    )
    const cap = useGameStore(selectIncreaseGrowSpeedCap)

    const onClickStart = useCallback(() => addIncreaseGrowSpeed(woodType, location), [woodType, location])
    const onClickRemove = useCallback(() => removeActivity(actId), [actId])

    if (actId)
        return (
            <Button onClick={onClickRemove} variant="destructive">
                {t.Stop}
            </Button>
        )

    return (
        <AddActivityDialog
            addBtn={
                <Button onClick={onClickStart}>
                    {t.IncreaseGrowSpeed} ({active}/{cap})
                </Button>
            }
            title={
                <>
                    {IconsData.Forest} {t.IncreaseGrowSpeed}
                </>
            }
            openBtn={
                <Button>
                    {t.IncreaseGrowSpeed} ({active}/{cap})
                </Button>
            }
        />
    )
})

const GrowSpeedProgress = memo(function GrowSpeedProgress() {
    const woodType = useGameStore(selectWoodType)
    const location = useGameStore((s) => s.location)
    const actId = useGameStore(
        useCallback((s) => selectIncreaseGrowSpeedId(s, woodType, location), [woodType, location])
    )

    return <GameTimerProgress actionId={actId} color="success" className="mb-2" />
})

const Forest = memo(function Forest() {
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
                <ForestRespawn />
                <Trees />
            </CardContent>
        </Card>
    )
})

const ForestQta = memo(function ForestQta() {
    const woodType = useGameStore(selectWoodType)
    const qta = useGameStore(useCallback((s) => selectForestQta(s, woodType), [woodType]))
    const def = useGameStore(useShallow(useCallback((state) => selectDefaultForest(state, woodType), [woodType])))
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
            {t.Time} {fun.formatTime(respawn)}
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
