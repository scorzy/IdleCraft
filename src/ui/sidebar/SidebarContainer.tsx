import classes from './sidebarContainer.module.css'
import List from '@mui/material/List'
import { memo, ReactNode } from 'react'

export const SidebarContainer = memo((props: { children?: ReactNode }) => {
    const { children } = props
    return (
        <List dense className={classes.sidebarContainer}>
            {children}
        </List>
    )
})
SidebarContainer.displayName = 'SidebarContainer'
