import { Collapse, useMediaQuery, useTheme } from '@mui/material'
import classes from './sidebarContainer.module.css'
import List from '@mui/material/List'
import { memo, ReactNode } from 'react'
import { useGameStore } from '../../game/state'
import { collapse } from '../state/uiFunctions'
import { isCollapsed } from '../state/uiSelectors'
import { clsx } from 'clsx'
import { MyListItem } from './MenuItem'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

export const SidebarContainer = memo(function SidebarContainer(props: { children?: ReactNode; id: string }) {
    const { children, id } = props
    const collapsedLarge = useGameStore(isCollapsed(id))
    const collapseClick = () => collapse(id)
    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.up('md'))
    const collapsed = collapsedLarge || !matches

    if (!matches)
        return (
            <List dense className={clsx(classes.sidebarContainer)}>
                {children}
            </List>
        )

    return (
        <Collapse in={collapsed} orientation="horizontal" collapsedSize={40} className={classes.collapseContainer}>
            <div className={classes.collapseContainer}>
                <List dense className={clsx(classes.sidebarContainer, { [classes.collapsed]: !collapsed })}>
                    {children}
                </List>
                {matches && (
                    <List dense className={clsx(classes.sidebarContainer, { [classes.collapsed]: !collapsed })}>
                        <MyListItem
                            onClick={collapseClick}
                            active={false}
                            icon={
                                <ArrowBackIosNewIcon
                                    className={clsx(classes.icon, { [classes.iconCollapsed]: !collapsed })}
                                />
                            }
                            text={''}
                            collapsed={collapsed}
                        />
                    </List>
                )}
            </div>
        </Collapse>
    )
})
