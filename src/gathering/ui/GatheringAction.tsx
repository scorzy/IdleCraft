import { memoize } from 'proxy-memoize'
import { memo, useCallback } from 'react'
import { ActivityAdapter, ActivityTypes } from '../../activities/ActivityState'
import { removeActivity } from '../../activities/functions/removeActivity'
import { AddActivityDialog } from '../../activities/ui/AddActivityDialog'
import { BonusDialog } from '../../bonus/ui/BonusUi'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardFooter } from '../../components/ui/card'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { IconsData } from '../../icons/Icons'
import { useTranslations } from '../../msg/useTranslations'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { MyLabel } from '../../ui/myCard/MyLabel'
import { GameTimerProgress } from '../../ui/progress/TimerProgress'
import { addGathering } from '../functions/addGathering'
import { GatheringZone } from '../gatheringZones'
import { selectGatheringTime } from '../selectors/gatheringTime'

export const GatheringAction = memo(function GatheringAction() {
    const { t, fun } = useTranslations()
    const zone = useGameStore((s) => s.ui.gatheringZone)
    const actId = useGameStore(useCallback((s: GameState) => selectGatheringActivityId(s, zone), [zone]))
    const time = useGameStore(useCallback((s: GameState) => selectGatheringTime(zone).gatheringTime(s), [zone]))

    const selectGatheringTimeAllMemo = useCallback(
        (s: GameState) => memoize(selectGatheringTime(zone).gatheringTimeAll)(s),
        [zone]
    )

    const onAdd = useCallback(() => addGathering(zone), [zone])
    const onStop = useCallback(() => removeActivity(actId), [actId])

    return (
        <Card>
            <MyCardHeaderTitle title={t.Gathering} icon={IconsData.Forest} />
            <CardContent>
                <MyLabel>
                    {t.Time} {fun.formatTime(time)}
                    <BonusDialog title={t.Time} selectBonusResult={selectGatheringTimeAllMemo} isTime={true} />
                </MyLabel>
                <GameTimerProgress actionId={actId} color="success" />
            </CardContent>
            <CardFooter className="flex gap-2">
                {actId ? (
                    <Button variant="destructive" onClick={onStop}>
                        {t.Stop}
                    </Button>
                ) : (
                    <AddActivityDialog
                        title={t.Gathering}
                        openBtn={<Button>{t.Gathering}</Button>}
                        addBtn={<Button onClick={onAdd}>{t.Add}</Button>}
                    />
                )}
            </CardFooter>
        </Card>
    )
})

function selectGatheringActivityId(state: GameState, zone: GatheringZone) {
    return ActivityAdapter.find(
        state.activities,
        (activity) => activity.type === ActivityTypes.Gathering && 'zone' in activity && activity.zone === zone
    )?.id
}
