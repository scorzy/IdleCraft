import { memoize } from 'proxy-memoize'
import { memo, useCallback, useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
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
import { RestartProgress } from '../../ui/progress/RestartProgress'
import { GameTimerProgress } from '../../ui/progress/TimerProgress'
import { selectWoodType } from '../../ui/state/uiSelectors'
import { selectDefaultForest, selectForest } from '../forest/forestSelectors'
import { addWoodcutting } from '../functions/addWoodcutting'
import { selectWoodcuttingId } from '../selectors/WoodcuttingSelectors'
import { selectWoodcuttingDamage, selectWoodcuttingDamageAll } from '../selectors/woodcuttingDamage'
import { selectWoodcuttingTime, selectWoodcuttingTimeAll } from '../selectors/woodcuttingTime'

export const Cutting = memo(function Cutting() {
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
                <GameTimerProgress actionId={act} color="primary" className="mb-2" />
            </CardContent>
            <CardFooter className="flex gap-2">
                <CuttingButton />
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
