import { memo } from 'react'
import { Card, CardContent } from '../../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { useGameStore } from '../../game/state'
import { IconsData } from '../../icons/Icons'
import { useItemName } from '../../items/selectors/useItemName'
import { ItemIcon } from '../../items/ui/ItemIcon'
import { Msg } from '../../msg/Msg'
import { useTranslations } from '../../msg/useTranslations'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { GatheringData } from '../gatheringData'
import { selectZoneLootTable } from '../selectors/selectZoneLootTable'

export const GatheringLootTable = memo(function GatheringLootTable() {
    const { f } = useNumberFormatter()
    const { t } = useTranslations()
    const zone = useGameStore((s) => s.ui.gatheringZone)
    const lootTable = selectZoneLootTable(zone)
    const bonusRolls = GatheringData[zone].bonusRolls

    if (!bonusRolls) return

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
                                <TableCell>
                                    {f(bonusRolls.find((r) => r.rarity === loot.rarity)?.chance ?? 0)}%{' '}
                                    {t[loot.rarity as keyof Msg]}
                                </TableCell>
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
