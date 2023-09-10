import { UiPages } from '../state/UiPages'
import { MenuItem } from './MenuItem'
import { memo } from 'react'
import { SidebarContainer } from './SidebarContainer'

export const Sidebar = memo(function Sidebar() {
    return (
        <SidebarContainer id="sidebar">
            <MenuItem page={UiPages.Activities} />
            <MenuItem page={UiPages.Storage} />
            <MenuItem page={UiPages.Woodcutting} />
            <MenuItem page={UiPages.Woodworking} />
            <MenuItem page={UiPages.Mining} />
        </SidebarContainer>
    )
})
