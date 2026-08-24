import { memo, useMemo, useState } from 'react'
import { memoize } from 'proxy-memoize'
import { TbInfoCircle } from 'react-icons/tb'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { useGameStore } from '../../game/state'
import { GameLocationDataMap } from '../../gameLocations/GameLocations'
import { useTranslations } from '../../msg/useTranslations'
import { selectItemLocationQuantities } from '../StorageSelectors'

export const ItemLocationsDialog = memo(function ItemLocationsDialog({ itemId }: { itemId: string }) {
    const { f } = useNumberFormatter()
    const { t } = useTranslations()
    const [open, setOpen] = useState(false)
    const selector = useMemo(() => memoize(selectItemLocationQuantities(itemId)), [itemId])
    const quantities = useGameStore(selector)
    const total = quantities.reduce((sum, entry) => sum + entry.quantity, 0)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <button title={t.Info} className="text-muted-foreground cursor-pointer" type="button">
                        <TbInfoCircle size={18} />
                    </button>
                }
            />
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t.Quantity}</DialogTitle>
                </DialogHeader>
                {open && (
                    <Table>
                        <TableBody>
                            {quantities.map(({ location, quantity }) => (
                                <TableRow key={location}>
                                    <TableCell>{t[GameLocationDataMap[location].name]}</TableCell>
                                    <TableCell className="text-right">{f(quantity)}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell>{t.Total}</TableCell>
                                <TableCell className="text-right">{f(total)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                )}
            </DialogContent>
        </Dialog>
    )
})
