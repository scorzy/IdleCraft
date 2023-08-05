import { UiPages } from '../state/UiPages'
import { MenuItem } from './MenuItem'
import { memo } from 'react'
import { SidebarContainer } from './SidebarContainer'

export const Sidebar = memo(() => {
    return (
        <SidebarContainer>
            <MenuItem page={UiPages.Activities} />
            <MenuItem page={UiPages.Storage} />
            <MenuItem page={UiPages.Woodcutting} />
        </SidebarContainer>
    )
})
Sidebar.displayName = 'Sidebar'
