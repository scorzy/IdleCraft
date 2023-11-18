import { memo } from 'react'
import { Page } from '../../ui/shell/AppShell'
import { PerksEnum } from '../perksEnum'
import { useGameStore } from '../../game/state'
import { useTranslations } from '../../msg/useTranslations'
import { ExpReq, PerksData } from '../Perk'
import { SetPerk, acquirePerkClick } from '../PerksFunctions'
import {
    hasPerk,
    IsPerkEnabled,
    IsPerkSelected,
    SelectCanSpendPerks,
    SelectMaxPerks,
    SelectPerk,
    SelectPerkCompleted,
    SelectUsedPerks,
    selectPerks,
} from '../PerksSelectors'
import { MyCard } from '../../ui/myCard/myCard'
import { Button, buttonVariants } from '../../components/ui/button'
import { cn } from '../../lib/utils'
import { TbCheck, TbLock, TbX } from 'react-icons/tb'
import { ExpData } from '../../experience/expEnum'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { selectLevel } from '../../experience/expSelectors'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toggleShowAvailablePerks, toggleCompletedPerks, toggleShowUnavailablePerks } from '../../ui/state/uiFunctions'
import { selectShowAvailablePerks, selectCompletedPerks, selectShowUnavailablePerks } from '../../ui/state/uiSelectors'
import classes from './perkUi.module.css'

export const PerksPage = memo(function PerksPage() {
    return (
        <Page>
            <div className="my-container">
                <MyCard className="fixed-height-2">
                    <PerksSidebar />
                </MyCard>
                <PerkPage />
            </div>
        </Page>
    )
})

const PerksSidebar = memo(function PerksSidebar() {
    const { f } = useNumberFormatter()
    const maxPerks = useGameStore(SelectMaxPerks)
    const usedPerks = useGameStore(SelectUsedPerks)
    const perks = useGameStore(selectPerks)
    const len = perks.length

    return (
        <div>
            <div className={classes.topPanel}>
                <span>
                    Used {f(usedPerks)}/{f(maxPerks)}
                </span>
                <PerkFilter />
            </div>
            {perks.map((t, index) => (
                <PerkLink key={t} perk={t} isLast={index >= len - 1} />
            ))}
        </div>
    )
})

const PerkFilter = memo(function PerkFilter() {
    const { t } = useTranslations()

    const available = useGameStore(selectShowAvailablePerks)
    const unavailable = useGameStore(selectShowUnavailablePerks)
    const completed = useGameStore(selectCompletedPerks)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary">Filter</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={`sort ${classes.dropDown!}`}>
                <DropdownMenuCheckboxItem checked={available} onCheckedChange={toggleShowAvailablePerks}>
                    {t.Available}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={unavailable} onCheckedChange={toggleShowUnavailablePerks}>
                    {t.NotAvailable}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={completed} onCheckedChange={toggleCompletedPerks}>
                    {t.Completed}
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
})

function PerkLink(props: { perk: PerksEnum; isLast: boolean }) {
    const { perk, isLast } = props
    const data = PerksData[perk]
    const { t } = useTranslations()
    const selected = useGameStore(IsPerkSelected(perk))
    const enabled = useGameStore(IsPerkEnabled(perk))
    const ownPerk = useGameStore(hasPerk(perk))
    return (
        <>
            <button
                onClick={SetPerk(perk)}
                className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'w-full justify-start gap-4 font-normal',
                    { 'bg-muted': selected },
                    { [classes.itemDisabled!]: !enabled },
                    classes.item
                )}
            >
                {enabled ? data.icon : <TbLock />}
                <span className="justify-self-start">{t[data.nameId]}</span>
                {ownPerk ? <TbCheck /> : <></>}
            </button>

            {!isLast && <hr className={classes.hr} />}
        </>
    )
}

const PerkPage = () => {
    const perk = useGameStore(SelectPerk)
    const data = PerksData[perk]
    const { t } = useTranslations()
    const requirements = data.requiredExp ?? data.requiredPerks
    return (
        <MyCard title={t[data.nameId]} icon={data.icon} actions={<PerkButton />}>
            {t[data.descId]}
            {requirements && <span>Requirements</span>}
            {requirements && (
                <ul>
                    {data.requiredExp?.map((r) => <PerkExpReq req={r} key={r.skill} />)}
                    {data.requiredPerks?.map((r) => <PerkPerkReq perk={r} key={r} />)}
                </ul>
            )}
        </MyCard>
    )
}
const PerkExpReq = memo(function PerkExpReq(props: { req: ExpReq }) {
    const { req } = props
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    const level = useGameStore(selectLevel(req.skill))
    const skill = ExpData[req.skill]

    return (
        <li>
            {t[skill.nameId]} {f(req.level)}/{f(level)}
        </li>
    )
})
const PerkPerkReq = memo(function PerkPerkReq(props: { perk: PerksEnum }) {
    const { perk } = props
    const { t } = useTranslations()
    const ownPerk = useGameStore(hasPerk(perk))
    const perkData = PerksData[perk]

    return (
        <li className={classes.perkLi}>
            {ownPerk ? <TbCheck /> : <TbX />}
            {t[perkData.nameId]}
        </li>
    )
})

const PerkButton = memo(function PerkButton() {
    const perk = useGameStore(SelectPerk)
    const { t } = useTranslations()
    const enabled = useGameStore(IsPerkEnabled(perk))
    const completed = useGameStore(SelectPerkCompleted(perk))
    const canSpend = useGameStore(SelectCanSpendPerks)
    return (
        <Button disabled={!enabled || completed || !canSpend} onClick={acquirePerkClick(perk)}>
            {t.Select}
        </Button>
    )
})
