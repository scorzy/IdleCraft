import List from '@mui/joy/List'
import { MenuItem } from './MenuItem'
import { UiPages } from './state/UiPages'
import { memo } from 'react'

export const Sidebar = memo(() => {
    return (
        <List>
            <MenuItem page={UiPages.Activities} />
            <MenuItem page={UiPages.Storage} />
            <MenuItem page={UiPages.Woodcutting} />
        </List>
    )
})
Sidebar.displayName = 'Sidebar'
