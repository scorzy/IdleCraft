import { memo } from 'react'
import { TbInfoCircle } from 'react-icons/tb'
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
    selectBonusResult: (state: GameState) => BonusResult
    isTime?: boolean
}) {
    const { selectBonusResult, isTime } = props
    const { f, ft } = useNumberFormatter()
    const { t } = useTranslations()
    const format = isTime ? ft : f
    const bonusRes = useGameStore(selectBonusResult)

    return (
        <Table>
            <TableBody>
                {bonusRes.bonuses.map((b) => (
                    <BonusUi key={b.id} bonus={b} isTime={isTime} />
                ))}

                <TableRow>
                    <TableCell colSpan={2} className="w-[100px]">
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
    const { t } = useTranslations()
    const { f, ft } = useNumberFormatter()
    const format = isTime ? ft : f

    return (
        <TableRow>
            <TableCell className="w-[30px] text-lg">{IconsData[bonus.iconId]}</TableCell>
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
    selectBonusResult: (state: GameState) => BonusResult
    isTime?: boolean
}) {
    const { selectBonusResult, title, isTime } = props
    const { t } = useTranslations()

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button title={t.Info} className="text-muted-foreground" type="button">
                    <TbInfoCircle size={18} />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <DialogDescription></DialogDescription>
                <BonusListUi selectBonusResult={selectBonusResult} isTime={isTime} />
            </DialogContent>
        </Dialog>
    )
})
