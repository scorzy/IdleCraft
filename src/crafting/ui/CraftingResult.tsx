import { memo, ReactNode, useCallback } from 'react'
import { AlertCircleIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { useItemName } from '@/items/selectors/useItemName'
import { MyLabel } from '@/ui/myCard/MyLabel'
import { isPotionItem } from '../../alchemy/PotionCraftingResult'
import { PotionResultUi } from '../../alchemy/PotionResultUi'
import { CardContent } from '../../components/ui/card'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { useGameStore } from '../../game/state'
import { Icons, IconsData } from '../../icons/Icons'
import { Item } from '../../items/Item'
import { StdItems } from '../../items/stdItems'
import { ItemIcon } from '../../items/ui/ItemIcon'
import { ItemInfo } from '../../items/ui/ItemInfo'
import { useTranslations } from '../../msg/useTranslations'
import { selectGameItem, selectItemQta } from '../../storage/StorageSelectors'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { selectCraftingAutoBuy, selectCraftingPurchasePlan, selectResultQta } from '../CraftingSelectors'
import { CraftingPurchaseLine } from '../functions/autoBuyCrafting'
import { RecipeItem, RecipeItemReq } from '../RecipeInterfaces'

export const CraftingResult = memo(function CraftingResult({ result }: { result: RecipeItem | undefined }) {
    if (!result) return null
    let item: Item | undefined = undefined

    const isPotion = isPotionItem(result)
    if (isPotion) item = result.uiCraftedItem
    else if (result.craftedItem) item = result.craftedItem
    else if (result.stdItemId) item = StdItems[result.stdItemId]

    const info = isPotion ? <PotionResultUi result={result} /> : null

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
    const { f } = useNumberFormatter()
    const { t } = useTranslations()
    const plan = useGameStore(selectCraftingPurchasePlan)
    const autoBuy = useGameStore(selectCraftingAutoBuy)
    const gold = useGameStore((state) => state.gold)

    if (!req) return null
    const showAutoBuyCost = req.some((requirement) => autoBuy[requirement.itemId])

    return (
        <Table>
            <TableBody>
                {req.map((r) => (
                    <CraftingReqRow
                        req={r}
                        purchaseLine={plan.lines.find((line) => line.itemId === r.itemId)}
                        missing={plan.missingItemIds.includes(r.itemId)}
                        key={r.itemId}
                    />
                ))}
                {showAutoBuyCost && (
                    <TableRow>
                        <TableCell colSpan={3}>{t.GoldToSpend}</TableCell>
                        <TableCell className="text-right">
                            <span className="inline-flex items-center gap-1">
                                {IconsData[Icons.Coins]} {f(plan.totalCost)} / {f(gold)}
                                {!plan.hasEnoughGold && <AccessibleErrorIcon label={t.NotEnoughGold} />}
                            </span>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
})

const CraftingReqRow = memo(function CraftingReqRow({
    req,
    purchaseLine,
    missing,
}: {
    req: RecipeItemReq
    purchaseLine?: CraftingPurchaseLine
    missing: boolean
}) {
    const { f } = useNumberFormatter()
    const { t } = useTranslations()
    const item = useGameStore(selectGameItem(req.itemId))
    const autoBuy = useGameStore(useCallback((state) => !!state.craftingForm.autoBuy[req.itemId], [req.itemId]))
    const itemName = useItemName(item)

    if (!item) return null
    return (
        <TableRow>
            <TableCell>{<ItemIcon itemId={item.id} />}</TableCell>
            <TableCell width={'100%'}>{itemName}</TableCell>
            <TableCell width={'100%'}>
                {autoBuy && (
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        <Badge variant="outline">{t.AutoBuy}</Badge>
                        {purchaseLine && (
                            <span className="text-muted-foreground inline-flex items-center gap-1 text-xs whitespace-nowrap">
                                {f(purchaseLine.quantity)} {t.Per} {IconsData[Icons.Coins]} {f(purchaseLine.cost)}
                            </span>
                        )}
                    </div>
                )}
            </TableCell>
            <TableCell>
                <span className="inline-flex items-center gap-1 text-nowrap">
                    {f(req.qta)}
                    <span className="text-muted-foreground">
                        / <CraftingReqRowHaveQta itemId={req.itemId} />
                    </span>
                    {missing && <AccessibleErrorIcon label={`${t.NotEnoughItems}: ${itemName}`} />}
                </span>
            </TableCell>
        </TableRow>
    )
})

const AccessibleErrorIcon = memo(function AccessibleErrorIcon({ label }: { label: string }) {
    return (
        <span className="text-destructive inline-flex" role="img" aria-label={label} title={label}>
            <AlertCircleIcon className="size-4" aria-hidden="true" />
        </span>
    )
})

export const CraftingReqRowHaveQta = memo(function CraftingReqRowHaveQta(props: { itemId: string }) {
    const { itemId } = props
    const { f } = useNumberFormatter()
    const qtaStorage = useGameStore(selectItemQta(null, itemId))
    return f(qtaStorage)
})
