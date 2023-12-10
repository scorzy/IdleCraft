import { ReactNode, memo } from 'react'
import { TbInfoCircle } from 'react-icons/tb'
import { Bonus, BonusResult } from '../Bonus'
import { IconsData } from '../../icons/Icons'
import { PerksData } from '../../perks/Perk'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { useTranslations } from '../../msg/useTranslations'
import { Msg } from '../../msg/Msg'
import { useGameStore } from '../../game/state'
import { selectGameItem } from '../../storage/StorageSelectors'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

export const BonusSpan = memo(function BonusSpan(props: { children: ReactNode }) {
    const { children } = props
    return <span className="grid grid-flow-col justify-start gap-2">{children}</span>
})
export const BonusListUi = memo(function BonusListUi(props: { bonusResult: BonusResult; isTime?: boolean }) {
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
export const BonusUi = memo(function BonusUi(props: { bonus: Bonus; isTime?: boolean }) {
    const { bonus, isTime } = props
    const { t } = useTranslations()
    const { f, ft } = useNumberFormatter()
    const format = isTime ? ft : f

    let icon: React.ReactNode = <></>
    let name: keyof Msg

    const item = useGameStore(selectGameItem(bonus.stdItemId, bonus.craftItemId))

    if (item) {
        icon = IconsData[item.icon]
        name = item.nameId
    } else if (bonus.baseBonus) {
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
                <button>
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
