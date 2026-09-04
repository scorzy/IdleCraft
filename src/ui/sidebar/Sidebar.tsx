import { memo, ReactNode } from 'react'
import { GiAllForOne, GiAnvilImpact, GiThreeLeaves } from 'react-icons/gi'
import { selectActivityNum } from '../../activities/ActivitySelectors'
import { Badge } from '../../components/ui/badge'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { useGameStore } from '../../game/state'
import { Icons, IconsData } from '../../icons/Icons'
import { useTranslations } from '../../msg/useTranslations'
import { UiPages } from '../state/UiPages'
import { selectAnyPageUnlocked } from '../state/pageUnlocks'
import { lockedIcon, sidebarOpen } from '../state/uiFunctions'
import { CollapsedEnum } from './CollapsedEnum'
import { CollapsibleMenu, MenuItem, MyListItem } from './MenuItem'
import { SidebarContainer } from './SidebarContainer'

export const Sidebar = memo(function Sidebar() {
    return (
        <SidebarContainer collapsedId={CollapsedEnum.Sidebar}>
            <MenuItem page={UiPages.Activities} collapsedId={CollapsedEnum.Sidebar} right={<ActivitiesLinkBadge />} />
            <MenuItem page={UiPages.Storage} collapsedId={CollapsedEnum.Sidebar} />
            <MenuItem page={UiPages.Vendors} collapsedId={CollapsedEnum.Sidebar} right={<VendorGoldBadge />} />
            <MenuItem page={UiPages.Characters} collapsedId={CollapsedEnum.Sidebar} />
            <MenuItem page={UiPages.World} collapsedId={CollapsedEnum.Sidebar} />
            <MenuItem page={UiPages.Caravans} collapsedId={CollapsedEnum.Sidebar} />
            <MenuItem page={UiPages.Quest} collapsedId={CollapsedEnum.Sidebar} />

            <SidebarBattle />
            <SidebarGathering />
            <SidebarCraft />
        </SidebarContainer>
    )
})

const ActivitiesLinkBadge = memo(function ActivitiesLinkBadge() {
    const actNum = useGameStore(selectActivityNum)
    const { f } = useNumberFormatter()
    if (actNum === 0) return
    return <Badge variant="secondary">{f(actNum)}</Badge>
})
const VendorGoldBadge = memo(function VendorGoldBadge() {
    const gold = useGameStore((state) => state.gold)
    const { f } = useNumberFormatter()

    return (
        <Badge variant="secondary" className="ml-auto gap-1">
            {IconsData[Icons.Coins]}
            {f(gold)}
        </Badge>
    )
})
const SidebarBattle = memo(function SidebarGathering() {
    const open = useGameStore(sidebarOpen)
    const unlocked = useGameStore(selectAnyPageUnlocked([UiPages.CombatZones, UiPages.Combat]))

    if (!unlocked) return <LockedSidebarGroup icon={<GiAllForOne />} />

    return (
        <CollapsibleMenu
            key={open ? '1' : '0'}
            collapsedId={CollapsedEnum.CombatSide}
            name="Battle"
            parentCollapsedId={CollapsedEnum.Sidebar}
            icon={<GiAllForOne />}
        >
            <MenuItem page={UiPages.CombatZones} collapsedId={CollapsedEnum.Sidebar} />
            <MenuItem page={UiPages.Combat} collapsedId={CollapsedEnum.Sidebar} />
        </CollapsibleMenu>
    )
})
const SidebarGathering = memo(function SidebarGathering() {
    const open = useGameStore(sidebarOpen)

    return (
        <CollapsibleMenu
            key={open ? '1' : '0'}
            collapsedId={CollapsedEnum.GatheringSide}
            name="Activities"
            parentCollapsedId={CollapsedEnum.Sidebar}
            icon={<GiThreeLeaves />}
        >
            <MenuItem page={UiPages.Market} collapsedId={CollapsedEnum.Sidebar} />
            <MenuItem page={UiPages.Woodcutting} collapsedId={CollapsedEnum.Sidebar} />
            <MenuItem page={UiPages.Mining} collapsedId={CollapsedEnum.Sidebar} />
            <MenuItem page={UiPages.Gathering} collapsedId={CollapsedEnum.Sidebar} />
        </CollapsibleMenu>
    )
})
const SidebarCraft = memo(function SidebarCraft() {
    const open = useGameStore(sidebarOpen)
    const unlocked = useGameStore(
        selectAnyPageUnlocked([UiPages.Woodworking, UiPages.Smithing, UiPages.Butchering, UiPages.Alchemy])
    )

    if (!unlocked) return <LockedSidebarGroup icon={<GiAnvilImpact />} />

    return (
        <CollapsibleMenu
            key={open ? '2' : '3'}
            collapsedId={CollapsedEnum.CraftingSide}
            name="Crafting"
            parentCollapsedId={CollapsedEnum.Sidebar}
            icon={<GiAnvilImpact />}
        >
            <MenuItem page={UiPages.Woodworking} collapsedId={CollapsedEnum.Sidebar} />
            <MenuItem page={UiPages.Smithing} collapsedId={CollapsedEnum.Sidebar} />
            <MenuItem page={UiPages.Butchering} collapsedId={CollapsedEnum.Sidebar} />
            <MenuItem page={UiPages.Alchemy} collapsedId={CollapsedEnum.Sidebar} />
        </CollapsibleMenu>
    )
})

const LockedSidebarGroup = memo(function LockedSidebarGroup({ icon }: { icon: ReactNode }) {
    const { t } = useTranslations()

    return (
        <MyListItem active={false} collapsedId={CollapsedEnum.Sidebar} icon={lockedIcon(icon, false)} text={t.Locked} />
    )
})
