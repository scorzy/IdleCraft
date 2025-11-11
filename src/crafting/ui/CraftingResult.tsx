import { memo, ReactNode } from 'react'
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
import { isPotionItem, PotionItem } from '../../alchemy/PotionCraftingResult'
import { PotionResultUi } from '../../alchemy/PotionResultUi'
import { ItemIcon } from '../../items/ui/ItemIcon'
import { useItemName } from '@/items/useItemName'
import { MyLabel } from '@/ui/myCard/MyLabel'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

export const CraftingResult = memo(function CraftingResult({ result }: { result: RecipeItem | undefined }) {
    if (!result) return null
    let item: Item | undefined = undefined
    const isPotion = isPotionItem(result)
    if (isPotion) item = result.uiCraftedItem
    else if (result.craftedItem) item = result.craftedItem
    else if (result.stdItemId) item = StdItems[result.stdItemId]

    const info = isPotion ? <PotionResultUi result={result as PotionItem} /> : null

    if (!item) {
        if (info) return <>{info}</>

        return null
    }
    return <CraftingResult2 result={result} item={item} info={info} />
})

export const CraftingResult2 = memo(function CraftingResult2(props: {
    result: RecipeItem
    info?: ReactNode
    item: Item
}) {
    const { result, info, item } = props
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    const itemName = useItemName(item)

    return (
        <>
            <MyCardHeaderTitle title={itemName} icon={<ItemIcon itemId={item} />} />
            <CardContent>
                <div className="text-sm">
                    <MyLabel>
                        {t.Quantity} {f(result.qta)}{' '}
                        <span className="text-muted-foreground">
                            {t.YouHave} <CraftingResultHaveQta result={result} />
                        </span>
                    </MyLabel>
                    {info}
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

export const CraftingReq = memo(function CraftingReq({ req }: { req: RecipeItemReq[] | undefined }) {
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
const CraftingReqRow = memo(function CraftingReqRow({ req }: { req: RecipeItemReq }) {
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
