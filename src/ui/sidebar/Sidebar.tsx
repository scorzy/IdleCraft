import { memo } from 'react'
import { GiAnvilImpact, GiThreeLeaves } from 'react-icons/gi'
import { UiPages } from '../state/UiPages'
import { useGameStore } from '../../game/state'
import { sidebarOpen } from '../state/uiFunctions'
import { Badge } from '../../components/ui/badge'
import { selectActivityNum } from '../../activities/ActivitySelectors'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { isCollapsed } from '../state/uiSelectors'
import { SidebarContainer } from './SidebarContainer'
import { CollapsibleMenu, MenuItem } from './MenuItem'
import { CollapsedEnum } from './CollapsedEnum'

export const Sidebar = memo(function Sidebar() {
    const collapsed = useGameStore(isCollapsed(CollapsedEnum.Sidebar))

    return (
        <SidebarContainer collapsedId={CollapsedEnum.Sidebar}>
            <MenuItem page={UiPages.Activities} parentCollapsed={collapsed} right={<ActivitiesLinkBadge />} />
            <MenuItem page={UiPages.Storage} parentCollapsed={collapsed} />
            <MenuItem page={UiPages.Characters} parentCollapsed={collapsed} />
            <MenuItem page={UiPages.CombatZones} parentCollapsed={collapsed} />
            <MenuItem page={UiPages.Combat} parentCollapsed={collapsed} />

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

const SidebarGathering = memo(function SidebarGathering() {
    const open = useGameStore(sidebarOpen)
    const isSidebarCollapsed = useGameStore(isCollapsed(CollapsedEnum.Sidebar))

    return (
        <CollapsibleMenu
            key={open ? '1' : '0'}
            collapsedId={CollapsedEnum.GatheringSide}
            parentCollapsed={isSidebarCollapsed}
            name="Gathering"
            icon={<GiThreeLeaves />}
        >
            <MenuItem page={UiPages.Woodcutting} parentCollapsed={isSidebarCollapsed} />
            <MenuItem page={UiPages.Mining} parentCollapsed={isSidebarCollapsed} />
        </CollapsibleMenu>
    )
})
const SidebarCraft = memo(function SidebarCraft() {
    const open = useGameStore(sidebarOpen)
    const isSidebarCollapsed = useGameStore(isCollapsed(CollapsedEnum.Sidebar))

    return (
        <CollapsibleMenu
            key={open ? '2' : '3'}
            collapsedId={CollapsedEnum.CraftingSide}
            parentCollapsed={isSidebarCollapsed}
            name="Crafting"
            icon={<GiAnvilImpact />}
        >
            <MenuItem page={UiPages.Woodworking} parentCollapsed={isSidebarCollapsed} />
            <MenuItem page={UiPages.Smithing} parentCollapsed={isSidebarCollapsed} />
        </CollapsibleMenu>
    )
})
