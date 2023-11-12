import { UiPages } from '../state/UiPages'
import { CollapsibleMenu, MenuItem } from './MenuItem'
import { memo } from 'react'
import { SidebarContainer } from './SidebarContainer'
import { GiAnvilImpact, GiThreeLeaves } from 'react-icons/gi'
import { useGameStore } from '../../game/state'
import {
    craftingCollapsed,
    gatheringCollapsed,
    sidebarCollapsed,
    sidebarOpen,
    toggleCrafting,
    toggleGathering,
    toggleSidebar,
} from '../state/uiFunctions'

export const Sidebar = memo(function Sidebar() {
    const isSidebarCollapsed = useGameStore(sidebarCollapsed)
    const isGatheringCollapsed = useGameStore(gatheringCollapsed)
    const isCraftingCollapsed = useGameStore(craftingCollapsed)
    const open = useGameStore(sidebarOpen)

    return (
        <SidebarContainer collapsed={isSidebarCollapsed} collapseClick={toggleSidebar}>
            <MenuItem page={UiPages.Activities} parentCollapsed={isSidebarCollapsed} />
            <MenuItem page={UiPages.Storage} parentCollapsed={isSidebarCollapsed} />
            <MenuItem page={UiPages.Perks} parentCollapsed={isSidebarCollapsed} />
            <CollapsibleMenu
                key={open ? '1' : '0'}
                collapsed={isGatheringCollapsed}
                collapseClick={toggleGathering}
                parentCollapsed={isSidebarCollapsed}
                name="Gathering"
                icon={<GiThreeLeaves />}
            >
                <MenuItem page={UiPages.Woodcutting} parentCollapsed={isSidebarCollapsed} />
                <MenuItem page={UiPages.Mining} parentCollapsed={isSidebarCollapsed} />
            </CollapsibleMenu>
            <CollapsibleMenu
                key={open ? '2' : '3'}
                collapsed={isCraftingCollapsed}
                collapseClick={toggleCrafting}
                parentCollapsed={isSidebarCollapsed}
                name="Crafting"
                icon={<GiAnvilImpact />}
            >
                <MenuItem page={UiPages.Woodworking} parentCollapsed={isSidebarCollapsed} />
                <MenuItem page={UiPages.Smithing} parentCollapsed={isSidebarCollapsed} />
            </CollapsibleMenu>
        </SidebarContainer>
    )
})
