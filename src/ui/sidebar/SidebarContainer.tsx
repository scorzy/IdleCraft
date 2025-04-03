import { memo, ReactNode, useCallback, useEffect, useRef } from 'react'
import { clsx } from 'clsx'
import { LuChevronLeft } from 'react-icons/lu'
import { useMeasure } from 'react-use'
import { collapse, setSidebarWidth } from '../state/uiFunctions'
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

    const containerRef = useRef<HTMLDivElement | null>(null)
    const [setRef, { width }] = useMeasure()
    useEffect(() => {
        if (containerRef.current) setRef(containerRef.current)
    }, [setRef])

    useEffect(() => {
        setSidebarWidth(collapsedId, width)
    }, [collapsedId, width])

    return (
        <nav
            ref={containerRef}
            className={clsx(classes.collapseContainer, { [classes.collapsedContainer!]: collapsed }, className)}
        >
            <div className={clsx(classes.sidebarContainer, { [classes.collapsed!]: collapsed })}>{children}</div>

            <div className={clsx(classes.sidebarContainer, classes.btnExpand, { [classes.collapsed!]: collapsed })}>
                <MyListItem
                    onClick={collapseClick}
                    active={false}
                    icon={<LuChevronLeft className={clsx(classes.icon, { [classes.iconCollapsed!]: collapsed })} />}
                    text={''}
                    collapsedId={collapsedId}
                />
            </div>
        </nav>
    )
})
