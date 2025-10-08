import { memo } from 'react'
import { StdItems } from '../../items/stdItems'
import { Item } from '../../items/Item'
import { IconsData } from '../../icons/Icons'
import { useTranslations } from '../../msg/useTranslations'
import { RecipeItem, RecipeItemReq } from '../RecipeInterfaces'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { useGameStore } from '../../game/state'
import { selectGameItem, selectItemQta } from '../../storage/StorageSelectors'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { selectResultQta } from '../CraftingSelectors'
import { ItemInfo } from '../../items/ui/ItemInfo'
import { CardContent } from '../../components/ui/card'
import { isPotionItem } from '../../alchemy/PotionCraftingResult'
import { PotionResultUi } from '../../alchemy/PotionResultUi'
import { MyLabel } from '@/ui/myCard/MyLabel'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

export const CraftingResult = memo(function CraftingResult({ result }: { result: RecipeItem | undefined }) {
    const { t } = useTranslations()
    const { f } = useNumberFormatter()

    if (!result) return null

    let item: Item | undefined = undefined
    const isPotion = isPotionItem(result)
    if (isPotion) item = result.uiCraftedItem
    else if (result.craftedItem) item = result.craftedItem
    else if (result.stdItemId) item = StdItems[result.stdItemId]

    if (!item) return null

    return (
        <>
            <MyCardHeaderTitle title={t[item.nameId]} icon={IconsData[item.icon]} />
            <CardContent>
                <div className="text-sm">
                    <MyLabel>
                        {t.Quantity} {f(result.qta)}{' '}
                        <span className="text-muted-foreground">
                            {t.YouHave} <CraftingResultHaveQta result={result} />
                        </span>
                    </MyLabel>

                    {isPotion && <PotionResultUi result={result} />}
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
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    const item = useGameStore(selectGameItem(req.itemId))
    if (!item) return null
    return (
        <TableRow>
            <TableCell className="text-lg">{IconsData[item.icon]}</TableCell>
            <TableCell width={'100%'}>{t[item.nameId]}</TableCell>
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
