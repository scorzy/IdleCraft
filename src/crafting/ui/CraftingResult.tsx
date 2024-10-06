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
import { MyLabel } from '@/ui/myCard/MyLabel'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

export const CraftingResult = memo(function CraftingResult(props: { result: RecipeItem | undefined }) {
    const { result } = props
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    const have = useGameStore(selectResultQta(result))

    if (!result) return <></>

    const item: Item | undefined = result.craftedItem ?? StdItems[result.stdItemId ?? '']
    if (!item) return <></>

    return (
        <>
            <MyCardHeaderTitle title={t[item.nameId]} icon={IconsData[item.icon]} />
            <CardContent>
                <div className="text-sm text-muted-foreground">
                    <MyLabel>
                        {t.Quantity} {f(result.qta)}
                    </MyLabel>
                    <MyLabel>
                        {t.YouHave} {f(have)}
                    </MyLabel>
                    <ItemInfo item={item} />
                </div>
            </CardContent>
        </>
    )
})
export const CraftingReq = memo(function CraftingReq(props: { req: RecipeItemReq[] | undefined }) {
    const { req } = props

    if (!req) return <></>

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
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    const item = useGameStore(selectGameItem(req.itemId))
    const qtaStorage = useGameStore(selectItemQta(null, req.itemId))
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
