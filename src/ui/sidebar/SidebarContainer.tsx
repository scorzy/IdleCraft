import { Collapse } from '@mui/material'
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
    const collapsed = useGameStore(isCollapsed(id))
    const collapseClick = () => collapse(id)

    return (
        <Collapse in={collapsed} orientation="horizontal" collapsedSize={40} className={classes.collapseContainer}>
            <div className={classes.collapseContainer}>
                <List dense className={clsx(classes.sidebarContainer, { [classes.collapsed]: !collapsed })}>
                    {children}
                </List>
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
            </div>
        </Collapse>
    )
})
