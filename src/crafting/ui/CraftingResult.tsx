import { memo } from 'react'
import { StdItems } from '../../items/stdItems'
import { Item } from '../../items/Item'
import { useTranslations } from '../../msg/useTranslations'
import { RecipeItem, RecipeItemReq } from '../RecipeInterfaces'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { useGameStore } from '../../game/state'
import { selectGameItem, selectItemQta } from '../../storage/StorageSelectors'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { selectResultQta } from '../CraftingSelectors'
import { ItemInfo } from '../../items/ui/ItemInfo'
import { CardContent } from '../../components/ui/card'
import { GameIcon } from '../../icons/GameIcon'
import { ItemIcon } from '../../items/ui/ItemIcon'
import { useItemName } from '@/items/useItemName'
import { MyLabel } from '@/ui/myCard/MyLabel'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

export const CraftingResult = memo(function CraftingResult(props: { result: RecipeItem | undefined }) {
    const { result } = props
    if (!result) return null
    const item: Item | undefined = result.craftedItem ?? StdItems[result.stdItemId ?? '']
    if (!item) return null

    return <CraftingResult2 result={result} item={item} />
})

export const CraftingResult2 = memo(function CraftingResult2(props: { result: RecipeItem; item: Item }) {
    const { result, item } = props
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    const itemName = useItemName(item)

    return (
        <>
            <MyCardHeaderTitle title={itemName} icon={<GameIcon icon={item.icon} />} />
            <CardContent>
                <div className="text-sm">
                    <MyLabel>
                        {t.Quantity} {f(result.qta)}
                    </MyLabel>
                    <MyLabel>
                        {t.YouHave} <CraftingResultHaveQta result={result} />
                    </MyLabel>
                    <ItemInfo item={item} />
                </div>
            </CardContent>
        </>
    )
})

export const CraftingResultHaveQta = memo(function CraftingResultHaveQta(props: { result: RecipeItem | undefined }) {
    const { result } = props
    const { f } = useNumberFormatter()
    const have = useGameStore(selectResultQta(result))

    return f(have)
})

export const CraftingReq = memo(function CraftingReq(props: { req: RecipeItemReq[] | undefined }) {
    const { req } = props

    if (!req) return null

    return (
        <Table>
            <TableBody>
                {req.map((r) => (
                    <CraftingReqRow req={r} key={r.itemId} />
                ))}
            </TableBody>
        </Table>
    )
})
const CraftingReqRow = memo(function CraftingReqRow(props: { req: RecipeItemReq }) {
    const { req } = props
    const { f } = useNumberFormatter()
    const item = useGameStore(selectGameItem(req.itemId))
    const itemName = useItemName(item)
    if (!item) return null
    return (
        <TableRow>
            <TableCell>{<ItemIcon itemId={item.id} />}</TableCell>
            <TableCell width={'100%'}>{itemName}</TableCell>
            <TableCell>
                <span className="text-nowrap">
                    {f(req.qta)}
                    <span className="text-muted-foreground">
                        / <CraftingReqRowHaveQta itemId={req.itemId} />
                    </span>
                </span>
            </TableCell>
        </TableRow>
    )
})
const CraftingReqRowHaveQta = memo(function CraftingReqRowHaveQta(props: { itemId: string }) {
    const { itemId } = props
    const { f } = useNumberFormatter()
    const qtaStorage = useGameStore(selectItemQta(null, itemId))
    return f(qtaStorage)
})
