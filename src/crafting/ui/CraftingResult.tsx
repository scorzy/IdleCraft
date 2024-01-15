import { memo } from 'react'
import { StdItems } from '../../items/stdItems'
import { Item } from '../../items/Item'
import { IconsData } from '../../icons/Icons'
import { useTranslations } from '../../msg/useTranslations'
import { RecipeItem, RecipeItemReq } from '../RecipeInterfaces'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { useGameStore } from '../../game/state'
import { selectGameItem, selectItemQta } from '../../storage/StorageSelectors'
import { getItemId2 } from '../../storage/storageFunctions'
import { MyCard } from '../../ui/myCard/MyCard'
import { selectResultQta } from '../CraftingSelectors'
import { ItemInfo } from '../../items/ui/ItemInfo'
import { MyLabel } from '@/ui/myCard/MyLabel'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const CraftingResult = memo(function CraftingResult(props: { result: RecipeItem | undefined }) {
    const { result } = props
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    const have = useGameStore(selectResultQta(result))

    if (!result) return <></>

    const item: Item | undefined = result.craftedItem ?? StdItems[result.stdItemId ?? '']
    if (!item) return <></>

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {IconsData[item.icon]}
                    {t[item.nameId]}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <MyLabel>Crafting Quantity {f(result.qta)}</MyLabel>
                <MyLabel>You have {f(have)}</MyLabel>
                <ItemInfo item={item} />
            </CardContent>
        </Card>
    )
})
export const CraftingReq = memo(function CraftingReq(props: { req: RecipeItemReq[] | undefined }) {
    const { req } = props
    const { t } = useTranslations()

    if (!req) return <></>

    return (
        <MyCard title={t.Requirements}>
            <Table>
                <TableBody>
                    {req.map((r) => (
                        <CraftingReqRow req={r} key={getItemId2(r.stdItemId, r.craftedItemId)} />
                    ))}
                </TableBody>
            </Table>
        </MyCard>
    )
})
const CraftingReqRow = memo(function CraftingReqRow(props: { req: RecipeItemReq }) {
    const { req } = props
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    const item = useGameStore(selectGameItem(req.stdItemId, req.craftedItemId))
    const qtaStorage = useGameStore(selectItemQta(null, req.stdItemId, req.craftedItemId))
    if (!item) return <></>
    return (
        <TableRow>
            <TableCell className="text-lg">{IconsData[item.icon]}</TableCell>
            <TableCell width={'100%'}>{t[item.nameId]}</TableCell>
            <TableCell>
                {f(req.qta)}/{f(qtaStorage)}
            </TableCell>
        </TableRow>
    )
})
