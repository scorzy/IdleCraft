import { memo } from 'react'
import { TbInfoCircle } from 'react-icons/tb'
import { Bonus, BonusResult } from '../Bonus'
import { IconsData } from '../../icons/Icons'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { useTranslations } from '../../msg/useTranslations'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

const BonusListUi = memo(function BonusListUi(props: { bonusResult: BonusResult; isTime?: boolean }) {
    const { bonusResult, isTime } = props
    const { f, ft } = useNumberFormatter()
    const { t } = useTranslations()
    const format = isTime ? ft : f

    return (
        <Table>
            <TableBody>
                {bonusResult.bonuses.map((b) => (
                    <BonusUi key={b.id} bonus={b} isTime={isTime} />
                ))}

                <TableRow>
                    <TableCell colSpan={2} className="w-[100px]">
                        {t.Total}
                    </TableCell>
                    <TableCell className="text-right">{format(bonusResult.total)}</TableCell>
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
            <TableCell className="text-lg w-[30px]">{IconsData[bonus.iconId]}</TableCell>
            <TableCell className="text-left">
                {t[bonus.nameId]}
                {bonus.showQta && ` X ${f(bonus.showQta)}`}
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
    const bonusResult = useGameStore(selectBonusResult)

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button title={t.Info} className="text-muted-foreground">
                    <TbInfoCircle size={18} />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <BonusListUi bonusResult={bonusResult} isTime={isTime} />
            </DialogContent>
        </Dialog>
    )
})
