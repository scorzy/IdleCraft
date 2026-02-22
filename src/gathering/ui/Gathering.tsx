import { memo, useCallback } from 'react'
import { ActivityAdapter, ActivityTypes } from '../../activities/ActivityState'
import { AddActivityDialog } from '../../activities/ui/AddActivityDialog'
import { PLAYER_ID } from '../../characters/charactersConst'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
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
import { addGathering } from '../functions/addGathering'
import { GatheringData, RarityLabel, selectZoneLootTable } from '../gatheringData'
import { GatheringZone } from '../gatheringZones'
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
    const { t } = useTranslations()
    const zone = useGameStore((s) => s.ui.gatheringZone)
    const zoneData = GatheringData[zone]
    const actId = useGameStore(useCallback((s: GameState) => selectGatheringActivityId(s, zone), [zone]))

    const onAdd = useCallback(() => addGathering(zone), [zone])
    const onStop = useCallback(() => removeActivity(actId), [actId])

    return (
        <Card>
            <MyCardHeaderTitle title={t.Gathering} icon={IconsData.Forest} />
            <CardContent>
                <div className="mb-2">
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
                </div>
                <div className="text-muted-foreground mb-2 text-sm">{t[zoneData.nameId]}</div>
                <GameTimerProgress actionId={actId} color="success" />
            </CardContent>
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
