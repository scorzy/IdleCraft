import { memoize } from 'proxy-memoize'
import { memo, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { MyLabel, MyLabelContainer } from '@/ui/myCard/MyLabel'
import { removeActivity } from '../../activities/functions/removeActivity'
import { AddActivityDialog } from '../../activities/ui/AddActivityDialog'
import { BonusDialog } from '../../bonus/ui/BonusUi'
import { Card, CardContent, CardFooter } from '../../components/ui/card'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { IconsData } from '../../icons/Icons'
import { useTranslations } from '../../msg/useTranslations'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { GameTimerProgress } from '../../ui/progress/TimerProgress'
import { selectWoodType } from '../../ui/state/uiSelectors'
import {
    selectGrowSpeedBonusMulti,
    selectIncreaseGrowSpeedActiveCount,
    selectIncreaseGrowSpeedBonusAll,
    selectIncreaseGrowSpeedCap,
} from '../forest/growSpeedSelectors'
import { addIncreaseGrowSpeed } from '../functions/addIncreaseGrowSpeed'
import { INCREASE_GROW_SPEED_TIME } from '../GrowSpeedConst'
import { selectIncreaseGrowSpeedId } from '../selectors/WoodcuttingSelectors'

export const GrowSpeedBoost = memo(function GrowSpeedBoost() {
    const { f } = useNumberFormatter()
    const { t, fun } = useTranslations()

    const woodType = useGameStore(selectWoodType)
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
            <MyCardHeaderTitle title={fun.boostTree(woodType)} icon={IconsData.Forest} />
            <CardContent>
                <MyLabelContainer>
                    <MyLabel>
                        {t.Time} {fun.formatTime(INCREASE_GROW_SPEED_TIME)}
                    </MyLabel>
                    <MyLabel>
                        {t.IncreaseGrowSpeed} {activeBoost > 0 ? '+' : ''}
                        {f(activeBoost)}% ({f(activeStacks)}/{f(maxStacks)})
                        <BonusDialog title={t.IncreaseGrowSpeed} selectBonusResult={selectGrowSpeedBonusAllMemo} />
                    </MyLabel>
                </MyLabelContainer>
                <GrowSpeedProgress />
            </CardContent>
            <CardFooter className="flex gap-2">
                <GrowSpeedButton />
            </CardFooter>
        </Card>
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
