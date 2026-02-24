import { memo, useCallback } from 'react'
import { TbLock } from 'react-icons/tb'
import { memoize } from 'proxy-memoize'
import { ActivityAdapter, ActivityTypes } from '../../activities/ActivityState'
import { removeActivity } from '../../activities/functions/removeActivity'
import { AddActivityDialog } from '../../activities/ui/AddActivityDialog'
import { BonusDialog } from '../../bonus/ui/BonusUi'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardFooter } from '../../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { IconsData } from '../../icons/Icons'
import { ItemIcon } from '../../items/ui/ItemIcon'
import { useItemName } from '../../items/useItemName'
import { useTranslations } from '../../msg/useTranslations'
import { RequirementType } from '../../requirements/RequirementTypes'
import { getRequirementProgress } from '../../requirements/requirementFunctions'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { MyLabel } from '../../ui/myCard/MyLabel'
import { MyPage, MyPageAll } from '../../ui/pages/MyPage'
import { ProgressBar } from '../../ui/progress/ProgressBar'
import { setGatheringZone } from '../../ui/state/uiFunctions'
import { GameTimerProgress } from '../../ui/progress/TimerProgress'
import { selectGatheringTime, selectGatheringTimeAllMemo } from '../selectors/gatheringTime'
import { addGathering } from '../functions/addGathering'
import {
    GatheringSubZoneData,
    GatheringZoneSubZones,
    RarityLabel,
    ZoneImprovementsData,
    selectSubZoneLootTable,
} from '../gatheringData'
import { GatheringSubZone } from '../gatheringZones'
import { completeZoneImprovement, getSubZoneMainZone, isSubZoneUnlocked, selectZoneProgress } from '../zoneProgression'
import { GatheringSidebar } from './GatheringSidebar'

export const Gathering = memo(function Gathering() {
    const subZone = useGameStore((s) => s.ui.gatheringZone)
    const zone = getSubZoneMainZone(subZone)
    const zoneProgress = useGameStore(memoize((s) => selectZoneProgress(s, zone)))

    return (
        <MyPageAll sidebar={<GatheringSidebar />}>
            <MyPage className="page__main" key={subZone}>
                <Card>
                    <MyCardHeaderTitle title={`${zone} Level ${zoneProgress.level}`} icon={IconsData.Forest} />
                    <CardContent>
                        <MyLabel>
                            XP {zoneProgress.currentLevelExp} / {zoneProgress.nextLevelExp}
                        </MyLabel>
                        <ProgressBar
                            color="success"
                            value={(zoneProgress.currentLevelExp / Math.max(zoneProgress.nextLevelExp, 1)) * 100}
                        />
                    </CardContent>
                </Card>
                <SubZonesSection zoneSubZone={subZone} />
                <GatheringAction />
                <GatheringLootTable />
                <ZoneImprovements />
            </MyPage>
        </MyPageAll>
    )
})

const SubZonesSection = memo(function SubZonesSection({ zoneSubZone }: { zoneSubZone: GatheringSubZone }) {
    const zone = getSubZoneMainZone(zoneSubZone)
    return (
        <Card>
            <MyCardHeaderTitle title="SubZones" icon={IconsData.Forest} />
            <CardContent className="space-y-3">
                {GatheringZoneSubZones[zone].map((subZone) => (
                    <SubZoneRow key={subZone} subZone={subZone} />
                ))}
            </CardContent>
        </Card>
    )
})

const SubZoneRow = memo(function SubZoneRow({ subZone }: { subZone: GatheringSubZone }) {
    const unlocked = useGameStore((s) => isSubZoneUnlocked(s, subZone))
    const selected = useGameStore((s) => s.ui.gatheringZone === subZone)
    const onSelect = useCallback(() => unlocked && setGatheringZone(subZone), [subZone, unlocked])
    return (
        <div className="rounded border p-2">
            <div className="mb-2 flex items-center gap-2">
                {!unlocked && <TbLock />}
                <strong>{GatheringSubZoneData[subZone].name}</strong>
            </div>
            {!unlocked && <RequirementsList reqs={GatheringSubZoneData[subZone].unlockRequirements} />}
            {unlocked && (
                <Button variant={selected ? 'secondary' : 'outline'} onClick={onSelect}>
                    Enter
                </Button>
            )}
        </div>
    )
})

const GatheringAction = memo(function GatheringAction() {
    const { t, fun } = useTranslations()
    const zone = useGameStore((s) => s.ui.gatheringZone)
    const actId = useGameStore(useCallback((s: GameState) => selectGatheringActivityId(s, zone), [zone]))
    const time = useGameStore(selectGatheringTime)

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

function selectGatheringActivityId(state: GameState, zone: GatheringSubZone) {
    return ActivityAdapter.find(
        state.activities,
        (activity) => activity.type === ActivityTypes.Gathering && 'zone' in activity && activity.zone === zone
    )?.id
}

const GatheringLootTable = memo(function GatheringLootTable() {
    const { t } = useTranslations()
    const zone = useGameStore((s) => s.ui.gatheringZone)
    const lootTable = selectSubZoneLootTable(zone)

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

const ZoneImprovements = memo(function ZoneImprovements() {
    const subZone = useGameStore((s) => s.ui.gatheringZone)
    const zone = getSubZoneMainZone(subZone)
    const done = useGameStore((s) => s.gatheringZones[zone].completedImprovements)

    return (
        <Card>
            <MyCardHeaderTitle title="Zone Improvements" icon={IconsData.Forest} />
            <CardContent className="space-y-2">
                {ZoneImprovementsData[zone].map((improvement) => (
                    <div key={improvement.id} className="rounded border p-2">
                        <div className="font-semibold">{improvement.name}</div>
                        <div className="text-muted-foreground text-sm">{improvement.description}</div>
                        <RequirementsList reqs={improvement.requirements} />
                        <div>Reward: {improvement.rewardZoneExp} XP</div>
                        <Button
                            disabled={!!done[improvement.id]}
                            onClick={() => completeZoneImprovement(zone, improvement.id)}
                        >
                            {done[improvement.id] ? 'Completed' : 'Complete'}
                        </Button>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
})

const RequirementsList = memo(function RequirementsList({
    reqs,
}: {
    reqs: import('../../requirements/RequirementTypes').Requirement[]
}) {
    return (
        <ul className="list-disc pl-5 text-sm">
            {reqs.map((req) => (
                <RequirementRow key={req.id} req={req} />
            ))}
        </ul>
    )
})

const RequirementRow = memo(function RequirementRow({
    req,
}: {
    req: import('../../requirements/RequirementTypes').Requirement
}) {
    const progress = useGameStore((state) => getRequirementProgress(state, req))
    const done = progress >= req.quantity

    return (
        <li>
            {done ? '✅' : '🔒'} {requirementLabel(req.type)} {req.targetId}: {Math.min(progress, req.quantity)}/
            {req.quantity}
        </li>
    )
})

function requirementLabel(type: RequirementType) {
    if (type === RequirementType.KillMonster) return 'Kill'
    if (type === RequirementType.ConsumeResource) return 'Consume'
    if (type === RequirementType.DeliverResource) return 'Deliver'
    return 'Reach zone level'
}

const LootItem = memo(function LootItem({ itemId }: { itemId: string }) {
    const name = useItemName(itemId)
    return (
        <span className="inline-flex items-center gap-1">
            <ItemIcon itemId={itemId} /> {name}
        </span>
    )
})
