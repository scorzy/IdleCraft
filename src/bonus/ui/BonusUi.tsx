import { memo, useMemo, useState } from 'react'
import { TbInfoCircle } from 'react-icons/tb'
import { memoize } from 'proxy-memoize'
import { Bonus, BonusResult } from '../Bonus'
import { IconsData } from '../../icons/Icons'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { useTranslations } from '../../msg/useTranslations'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

const BonusListUi = memo(function BonusListUi(props: {
    selectBonusResult: BonusResult | ((state: GameState) => BonusResult)
    isTime?: boolean
}) {
    const { selectBonusResult, isTime } = props
    const { f } = useNumberFormatter()
    const { t, fun } = useTranslations()
    const format = isTime ? fun.formatTimePrecise : f

    const selectBonusResultMemo = useMemo(() => {
        if (typeof selectBonusResult === 'function') return memoize(selectBonusResult)
        return () => selectBonusResult
    }, [selectBonusResult])

    const bonusRes = useGameStore(selectBonusResultMemo)

    return (
        <Table>
            <TableBody>
                {bonusRes.bonuses.map((b) => (
                    <BonusUi key={b.id} bonus={b} isTime={isTime} />
                ))}

                <TableRow>
                    <TableCell colSpan={2} className="w-25">
                        {t.Total}
                    </TableCell>
                    <TableCell className="text-right">{format(bonusRes.total)}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
})

const BonusUi = memo(function BonusUi(props: { bonus: Bonus; isTime?: boolean }) {
    const { bonus, isTime } = props
    const { t, fun } = useTranslations()
    const { f } = useNumberFormatter()
    const format = isTime ? fun.formatTimePrecise : f

    return (
        <TableRow>
            <TableCell className="w-7.5 text-lg">{IconsData[bonus.iconId]}</TableCell>
            <TableCell className="text-left">
                {t[bonus.nameId]} {bonus.showQta && ` X ${f(bonus.showQta)}`}
            </TableCell>
            <TableCell className="text-right">
                {bonus.add && `${format(bonus.add)}`}
                {bonus.multi && bonus.multi > 0 && '+'}
                {bonus.multi && `${f(bonus.multi)}%`}
            </TableCell>
        </TableRow>
    )
})

export const BonusDialog = memo(function BonusDialog(props: {
    title: string
    selectBonusResult: BonusResult | ((state: GameState) => BonusResult)
    isTime?: boolean
}) {
    const { selectBonusResult, title, isTime } = props
    const { t } = useTranslations()
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button title={t.Info} className="text-muted-foreground cursor-pointer" type="button">
                    <TbInfoCircle size={18} />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <DialogDescription></DialogDescription>
                {open && <BonusListUi selectBonusResult={selectBonusResult} isTime={isTime} />}
            </DialogContent>
        </Dialog>
    )
})
