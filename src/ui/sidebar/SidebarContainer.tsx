import classes from './sidebarContainer.module.css'
import { memo, ReactNode } from 'react'
import { clsx } from 'clsx'
import { MyListItem } from './MenuItem'
import { LuChevronLeft } from 'react-icons/lu'

export const SidebarContainer = memo(function SidebarContainer(props: {
    children?: ReactNode
    collapsed: boolean
    collapseClick: () => void
}) {
    const { children, collapsed, collapseClick } = props

    return (
        <div className={clsx(classes.collapseContainer, { [classes.collapsedContainer]: collapsed })}>
            <div className={clsx(classes.sidebarContainer, { [classes.collapsed]: collapsed })}>{children}</div>

            <div className={clsx(classes.sidebarContainer, classes.btnExpand, { [classes.collapsed]: collapsed })}>
                <MyListItem
                    onClick={collapseClick}
                    active={false}
                    icon={<LuChevronLeft className={clsx(classes.icon, { [classes.iconCollapsed]: collapsed })} />}
                    text={''}
                    collapsed={collapsed}
                />
            </div>
        </div>
    )
})
