import { memo } from 'react'
import { MyCard } from '../../ui/myCard/myCard'
import { StdItems } from '../../items/stdItems'
import { Item } from '../../items/Item'
import { IconsData } from '../../icons/Icons'
import { useTranslations } from '../../msg/useTranslations'
import { RecipeItem, RecipeItemReq } from '../Recipe'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { Table, TableBody, TableCell, TableRow } from '@mui/material'
import { useGameStore } from '../../game/state'
import { selectItem, selectItemQta } from '../../storage/StorageSelectors'
import { getItemId2 } from '../../storage/storageFunctions'

export const CraftingResult = memo(function CraftingResult(props: { result: RecipeItem | undefined }) {
    const { result } = props
    const { t } = useTranslations()
    const { f } = useNumberFormatter()

    if (!result) return <></>

    const item: Item | undefined = result.craftedItemId ?? StdItems[result.stdItemId ?? '']
    if (!item) return <></>

    return (
        <MyCard icon={IconsData[item.icon]} title={t[item.nameId]}>
            Quantity <span className="monospace">{f(result.qta)}</span>
        </MyCard>
    )
})
export const CraftingReq = memo(function CraftingReq(props: { req: RecipeItemReq[] | undefined }) {
    const { req } = props
    //   const { t } = useTranslations()
    //  const { f } = useNumberFormatter()

    if (!req) return <></>

    return (
        <MyCard title={'Require'}>
            <Table size="small">
                {/* <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Item</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead> */}
                <TableBody>
                    {req.map((r) => (
                        <CraftingReqRow req={r} key={getItemId2(r.stdItemId, r.craftedItemId)} />
                    ))}
                </TableBody>
            </Table>
        </MyCard>
    )
})
export const CraftingReqRow = memo(function CraftingReqRow(props: { req: RecipeItemReq }) {
    const { req } = props
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    const item = useGameStore(selectItem(req.stdItemId, req.craftedItemId))
    const qtaStorage = useGameStore(selectItemQta(null, req.stdItemId, req.craftedItemId))
    if (!item) return <></>
    return (
        <TableRow>
            <TableCell>{IconsData[item.icon]}</TableCell>
            <TableCell width={'100%'}>{t[item.nameId]}</TableCell>
            <TableCell className="monospace">
                {f(req.qta)}/{f(qtaStorage)}
            </TableCell>
        </TableRow>
    )
})
