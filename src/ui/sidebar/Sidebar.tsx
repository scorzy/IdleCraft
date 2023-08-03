import { UiPages } from '../state/UiPages'
import { MenuItem } from './MenuItem'
import { memo } from 'react'

export const Sidebar = memo(() => {
    return (
        <nav className="sidebar">
            <MenuItem page={UiPages.Activities} />
            <MenuItem page={UiPages.Storage} />
            <MenuItem page={UiPages.Woodcutting} />
        </nav>
    )
})
Sidebar.displayName = 'Sidebar'
