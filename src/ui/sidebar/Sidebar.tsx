import { memo } from 'react'
import { GiAllForOne, GiAnvilImpact, GiThreeLeaves } from 'react-icons/gi'
import { UiPages } from '../state/UiPages'
import { useGameStore } from '../../game/state'
import { sidebarOpen } from '../state/uiFunctions'
import { Badge } from '../../components/ui/badge'
import { selectActivityNum } from '../../activities/ActivitySelectors'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { SidebarContainer } from './SidebarContainer'
import { CollapsibleMenu, MenuItem } from './MenuItem'
import { CollapsedEnum } from './CollapsedEnum'

export const Sidebar = memo(function Sidebar() {
    return (
        <SidebarContainer collapsedId={CollapsedEnum.Sidebar}>
            <MenuItem page={UiPages.Activities} collapsedId={CollapsedEnum.Sidebar} right={<ActivitiesLinkBadge />} />
            <MenuItem page={UiPages.Storage} collapsedId={CollapsedEnum.Sidebar} />
            <MenuItem page={UiPages.Characters} collapsedId={CollapsedEnum.Sidebar} />
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
const SidebarBattle = memo(function SidebarGathering() {
    const open = useGameStore(sidebarOpen)

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
            name="Gathering"
            parentCollapsedId={CollapsedEnum.Sidebar}
            icon={<GiThreeLeaves />}
        >
            <MenuItem page={UiPages.Woodcutting} collapsedId={CollapsedEnum.Sidebar} />
            <MenuItem page={UiPages.Mining} collapsedId={CollapsedEnum.Sidebar} />
        </CollapsibleMenu>
    )
})
const SidebarCraft = memo(function SidebarCraft() {
    const open = useGameStore(sidebarOpen)

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
        </CollapsibleMenu>
    )
})
