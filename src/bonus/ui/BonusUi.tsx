import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Bonus, BonusResult } from '../bonus'
import { IconsData } from '../../icons/Icons'
import { PerksData } from '../../perks/Perk'
import { memo } from 'react'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { useTranslations } from '../../msg/useTranslations'
import { Msg } from '../../msg/Msg'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { TbInfoCircle } from 'react-icons/tb'
import { Button } from '@/components/ui/button'

export const BonusListUi = memo(function BonusListUi(props: { bonusResult: BonusResult; isTime?: boolean }) {
    const { bonusResult, isTime } = props
    const { f, ft } = useNumberFormatter()
    const format = isTime ? ft : f

    return (
        <Table>
            <TableBody>
                {bonusResult.bonuses.map((b) => (
                    <BonusUi key={b.id} bonus={b} isTime={isTime} />
                ))}

                <TableRow>
                    <TableCell colSpan={2} className="w-[100px]">
                        Total
                    </TableCell>
                    <TableCell className="text-right">{format(bonusResult.total)}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
})
export const BonusUi = memo(function BonusUi(props: { bonus: Bonus; isTime?: boolean }) {
    const { bonus, isTime } = props
    const { t } = useTranslations()
    const { f, ft } = useNumberFormatter()
    const format = isTime ? ft : f

    let icon: React.ReactNode = <></>
    let name: keyof Msg

    if (bonus.baseBonus) {
        icon = IconsData[bonus.baseBonus.iconId]
        name = bonus.baseBonus.nameId
    } else if (bonus.perk) {
        const perk = PerksData[bonus.perk]
        icon = perk.icon
        name = perk.nameId
    } else throw new Error('[BonusUi] bonus data not found')

    return (
        <TableRow>
            <TableCell className="font-medium w-[30px]">{icon}</TableCell>
            <TableCell className="text-left">{t[name]}</TableCell>
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
    bonusResult: BonusResult
    isTime?: boolean
}) {
    const { bonusResult, title, isTime } = props
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" title="info">
                    <TbInfoCircle size={20} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        <BonusListUi bonusResult={bonusResult} isTime={isTime} />
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
})
