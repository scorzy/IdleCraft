import { UiPages } from '../state/UiPages'
import { CollapsibleMenu, MenuItem } from './MenuItem'
import { memo } from 'react'
import { SidebarContainer } from './SidebarContainer'
import { GiAnvilImpact, GiThreeLeaves } from 'react-icons/gi'

export const Sidebar = memo(function Sidebar() {
    return (
        <SidebarContainer id="sidebar">
            <MenuItem page={UiPages.Activities} />
            <MenuItem page={UiPages.Storage} />
            <CollapsibleMenu id="gathering" name="Gathering" icon={<GiThreeLeaves />}>
                <MenuItem page={UiPages.Woodcutting} />
                <MenuItem page={UiPages.Mining} />
            </CollapsibleMenu>
            <CollapsibleMenu id="crafting" name="Crafting" icon={<GiAnvilImpact />}>
                <MenuItem page={UiPages.Woodworking} />
                <MenuItem page={UiPages.Smithing} />
            </CollapsibleMenu>
        </SidebarContainer>
    )
})
