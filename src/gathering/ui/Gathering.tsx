import { memo, useCallback } from 'react'
import { memoize } from 'proxy-memoize'
import { ActivityAdapter, ActivityTypes } from '../../activities/ActivityState'
import { AddActivityDialog } from '../../activities/ui/AddActivityDialog'
import { PLAYER_ID } from '../../characters/charactersConst'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardFooter } from '../../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { ExpEnum } from '../../experience/ExpEnum'
import { ExperienceCard } from '../../experience/ui/ExperienceCard'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { IconsData } from '../../icons/Icons'
import { ItemIcon } from '../../items/ui/ItemIcon'
import { useItemName } from '../../items/useItemName'
import { useTranslations } from '../../msg/useTranslations'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { MyPage, MyPageAll } from '../../ui/pages/MyPage'
import { GameTimerProgress } from '../../ui/progress/TimerProgress'
import { removeActivity } from '../../activities/functions/removeActivity'
import { BonusDialog } from '../../bonus/ui/BonusUi'
import { addGathering } from '../functions/addGathering'
import { RarityLabel } from '../gatheringData'
import { selectZoneLootTable } from '../selectors/selectZoneLootTable'
import { GatheringZone } from '../gatheringZones'
import { MyLabel } from '../../ui/myCard/MyLabel'
import { selectGatheringTime } from '../selectors/gatheringTime'
import { GatheringSidebar } from './GatheringSidebar'

export const Gathering = memo(function Gathering() {
    const zone = useGameStore((s) => s.ui.gatheringZone)

    return (
        <MyPageAll
            sidebar={<GatheringSidebar />}
            header={
                <div className="page__info">
                    <ExperienceCard expType={ExpEnum.Gathering} charId={PLAYER_ID} />
                </div>
            }
        >
            <MyPage className="page__main" key={zone}>
                <GatheringAction />
                <GatheringLootTable />
            </MyPage>
        </MyPageAll>
    )
})

const GatheringAction = memo(function GatheringAction() {
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

const GatheringLootTable = memo(function GatheringLootTable() {
    const { t } = useTranslations()
    const zone = useGameStore((s) => s.ui.gatheringZone)
    const lootTable = selectZoneLootTable(zone)

    return (
        <Card>
            <MyCardHeaderTitle title={t.Loot} icon={IconsData.SwapBag} />
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t.ItemType}</TableHead>
                            <TableHead>{t.Name}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {lootTable.map((loot) => (
                            <TableRow key={loot.rarity}>
                                <TableCell>{RarityLabel[loot.rarity]}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-3">
                                        {loot.items.map((itemId) => (
                                            <LootItem key={itemId} itemId={itemId} />
                                        ))}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
})

const LootItem = memo(function LootItem({ itemId }: { itemId: string }) {
    const name = useItemName(itemId)

    return (
        <span className="inline-flex items-center gap-1">
            <ItemIcon itemId={itemId} /> {name}
        </span>
    )
})
