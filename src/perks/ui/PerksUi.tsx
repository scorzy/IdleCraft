import { memo } from 'react'
import { TbCheck, TbLock, TbX } from 'react-icons/tb'
import { useMediaQuery } from 'usehooks-ts'
import { PerksEnum } from '../perksEnum'
import { useGameStore } from '../../game/state'
import { useTranslations } from '../../msg/useTranslations'
import { ExpReq, PerksData } from '../Perk'
import { setPerk, acquirePerkClick, setPerksOpen } from '../PerksFunctions'
import {
    hasPerk,
    isPerkEnabled,
    isPerkSelected,
    selectCanSpendPerks,
    selectMaxPerks,
    selectPerk,
    selectPerkCompleted,
    selectUsedPerks,
    selectPerks,
} from '../PerksSelectors'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { Button } from '../../components/ui/button'
import { ExpData } from '../../experience/expEnum'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { selectLevel } from '../../experience/expSelectors'
import { toggleShowAvailablePerks, toggleCompletedPerks, toggleShowUnavailablePerks } from '../../ui/state/uiFunctions'
import {
    selectShowAvailablePerks,
    selectCompletedPerks,
    selectShowUnavailablePerks,
    isCollapsed,
    selectSelectedCharId,
    isCharReadonly,
} from '../../ui/state/uiSelectors'
import { IconsData } from '../../icons/Icons'
import { SidebarContainer } from '../../ui/sidebar/SidebarContainer'
import { CollapsedEnum } from '../../ui/sidebar/CollapsedEnum'
import { MyListItem } from '../../ui/sidebar/MenuItem'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Card, CardContent, CardFooter, CardTitle } from '../../components/ui/card'
import { MyTabNum } from '../../ui/myCard/MyTabNum'
import classes from './perkUi.module.css'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const PerksSidebar = memo(function PerksSidebar() {
    const { f } = useNumberFormatter()
    const { t } = useTranslations()
    const charId = useGameStore(selectSelectedCharId)
    const maxPerks = useGameStore(selectMaxPerks(charId))
    const usedPerks = useGameStore(selectUsedPerks(charId))
    const perks = useGameStore(selectPerks(charId))
    const collapsed = useGameStore(isCollapsed(CollapsedEnum.Perk))
    const readonly = useGameStore(isCharReadonly)

    return (
        <SidebarContainer collapsedId={CollapsedEnum.Perk}>
            {!collapsed && !readonly && (
                <div className={classes.topPanel}>
                    <span>
                        {t.Used} {f(usedPerks)}/{f(maxPerks)}
                    </span>
                    <PerkFilter />
                </div>
            )}
            {perks.map((t) => (
                <PerkLink key={t} perk={t} />
            ))}
        </SidebarContainer>
    )
})
export const PerksTab = memo(function PerksTab() {
    const { t } = useTranslations()
    const charId = useGameStore(selectSelectedCharId)
    const maxPerks = useGameStore(selectMaxPerks(charId))
    const usedPerks = useGameStore(selectUsedPerks(charId))
    const diff = Math.floor(maxPerks - usedPerks)

    return <MyTabNum text={t.Perks} num={diff} />
})
const PerkFilter = memo(function PerkFilter() {
    const { t } = useTranslations()

    const available = useGameStore(selectShowAvailablePerks)
    const unavailable = useGameStore(selectShowUnavailablePerks)
    const completed = useGameStore(selectCompletedPerks)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary">{t.Filter}</Button>
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

export const PerkLink = memo(function PerkLink(props: { perk: PerksEnum }) {
    const { perk } = props
    const { t } = useTranslations()
    const selected = useGameStore(isPerkSelected(perk))
    const enabled = useGameStore(isPerkEnabled(perk))
    const ownPerk = useGameStore(hasPerk(perk))
    const collapsed = useGameStore(isCollapsed(CollapsedEnum.Perk))

    const data = PerksData[perk]
    return (
        <MyListItem
            collapsed={collapsed}
            active={selected}
            text={t[data.nameId]}
            icon={enabled ? IconsData[data.iconId] : <TbLock />}
            onClick={setPerk(perk)}
            right={ownPerk ? <TbCheck /> : null}
        />
    )
})

export const PerkPage = () => {
    const { t } = useTranslations()
    const open = useGameStore(isCollapsed(CollapsedEnum.PerkS))
    const matches = useMediaQuery('(min-width: 900px)')
    const perk = useGameStore(selectPerk)
    const readonly = useGameStore(isCharReadonly)
    if (!perk) return
    const data = PerksData[perk]
    const requirements = data.requiredExp ?? data.requiredPerks

    const content = (
        <>
            {t[data.descId]}
            {requirements && <span>{t.Requirements}</span>}
            {requirements && (
                <ul>
                    {data.requiredExp?.map((r) => <PerkExpReq req={r} key={r.skill} />)}
                    {data.requiredPerks?.map((r) => <PerkPerkReq perk={r} key={r} />)}
                </ul>
            )}
        </>
    )
    return (
        <Card>
            <MyCardHeaderTitle title={t[data.nameId]} icon={IconsData[data.iconId]} />
            <CardContent>{content}</CardContent>
            {!readonly && (
                <CardFooter>
                    <PerkButton perk={perk} />
                </CardFooter>
            )}

            {!matches && (
                <Dialog open={open} onOpenChange={setPerksOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                <CardTitle>
                                    {IconsData[data.iconId]} {t[data.nameId]}
                                </CardTitle>
                            </DialogTitle>
                        </DialogHeader>
                        {content}
                        {!readonly && (
                            <DialogFooter>
                                <PerkButton perk={perk} />
                            </DialogFooter>
                        )}
                    </DialogContent>
                </Dialog>
            )}
        </Card>
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

const PerkButton = memo(function PerkButton(props: { perk: PerksEnum }) {
    const { perk } = props
    const { t } = useTranslations()
    const charId = useGameStore(selectSelectedCharId)

    const enabled = useGameStore(isPerkEnabled(perk))
    const completed = useGameStore(selectPerkCompleted(perk))
    const canSpend = useGameStore(selectCanSpendPerks(charId))
    return (
        <Button disabled={!enabled || completed || !canSpend} onClick={acquirePerkClick(perk)}>
            {t.Select}
        </Button>
    )
})
