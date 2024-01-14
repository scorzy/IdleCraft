import { memo, ReactNode, useCallback } from 'react'
import { clsx } from 'clsx'
import { LuChevronLeft } from 'react-icons/lu'
import { collapse } from '../state/uiFunctions'
import { useGameStore } from '../../game/state'
import { isCollapsed } from '../state/uiSelectors'
import { MyListItem } from './MenuItem'
import classes from './sidebarContainer.module.css'
import { CollapsedEnum } from './CollapsedEnum'

export const SidebarContainer = memo(function SidebarContainer(props: {
    children?: ReactNode
    className?: string
    collapsedId: CollapsedEnum
}) {
    const { children, className, collapsedId } = props

    const collapseClick = useCallback(() => collapse(collapsedId), [collapsedId])
    const collapsed = useGameStore(isCollapsed(collapsedId))

    return (
        <nav className={clsx(classes.collapseContainer, { [classes.collapsedContainer!]: collapsed }, className)}>
            <div className={clsx(classes.sidebarContainer, { [classes.collapsed!]: collapsed })}>{children}</div>

            <div className={clsx(classes.sidebarContainer, classes.btnExpand, { [classes.collapsed!]: collapsed })}>
                <MyListItem
                    onClick={collapseClick}
                    active={false}
                    icon={<LuChevronLeft className={clsx(classes.icon, { [classes.iconCollapsed!]: collapsed })} />}
                    text={''}
                    collapsed={collapsed}
                />
            </div>
        </nav>
    )
})
