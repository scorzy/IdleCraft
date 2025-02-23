import { ReactNode, memo, useCallback, useLayoutEffect, useState } from 'react'
import { clsx } from 'clsx'
import { TbChevronRight } from 'react-icons/tb'
import { useGameStore } from '../../game/state'
import { useTranslations } from '../../msg/useTranslations'
import { UiPages } from '../state/UiPages'
import { UiPagesData } from '../state/UiPagesData'
import { collapse, setPage } from '../state/uiFunctions'
import { Collapsible, CollapsibleContent } from '../../components/ui/collapsible'
import { Msg } from '../../msg/Msg'
import { getSidebarWidth, isCollapsed } from '../state/uiSelectors'
import { useUiTempStore } from '../state/uiTempStore'
import classes from './menuItem.module.css'
import { CollapsedEnum } from './CollapsedEnum'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export const MenuItem = memo(function MenuItem(props: {
    page: UiPages
    right?: ReactNode
    collapsedId: CollapsedEnum
}) {
    const { page, collapsedId, right } = props
    const { t } = useTranslations()
    const data = UiPagesData[page]
    const active = useGameStore((s) => s.ui.page === page)
    const onClick = useCallback(() => setPage(page), [page])

    return (
        <MyListItem
            onClick={onClick}
            text={t[data.nameId]}
            active={active}
            icon={data.icon}
            collapsedId={collapsedId}
            right={right}
        />
    )
})

export const MyListItem = memo(function MyListItem(props: {
    active: boolean
    text: string
    onClick?: () => void
    icon: ReactNode
    arrowOpen?: boolean
    right?: ReactNode
    enabled?: boolean
    collapsedId: CollapsedEnum
}) {
    const { text, onClick, active, icon, arrowOpen, right, collapsedId } = props
    let { enabled } = props

    const parentWidth = useUiTempStore(getSidebarWidth(collapsedId))

    const collapsed = parentWidth < 47

    if (enabled === undefined) enabled = true

    if (!collapsed || text === '') {
        let arrow = <></>
        if (arrowOpen !== undefined)
            arrow = <TbChevronRight className={clsx(classes.arrow, { [classes.arrowDown!]: arrowOpen })} />

        return (
            <button
                title={text}
                type="button"
                onClick={onClick}
                className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    { 'bg-muted hover:bg-muted': active },
                    { 'text-muted-foreground hover:bg-muted': !active },
                    'mt-1 justify-start gap-4 text-nowrap',
                    classes.item
                )}
            >
                {icon}
                {text}
                {right}
                {arrow}
            </button>
        )
    } else
        return (
            <TooltipProvider delayDuration={150}>
                <Tooltip>
                    <TooltipTrigger
                        onClick={onClick}
                        className={cn(
                            buttonVariants({ variant: 'ghost' }),
                            { 'bg-muted hover:bg-muted': active },
                            { 'text-muted-foreground hover:bg-muted': !active },
                            'mt-1 justify-start gap-4',
                            classes.item,
                            collapsed ? classes.itemCollapsed : ''
                        )}
                    >
                        {icon}
                    </TooltipTrigger>
                    <TooltipContent side="right">{text}</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
})

export const CollapsibleMenu = memo(function CollapsibleMenu(props: {
    name: keyof Msg
    icon: ReactNode
    children: ReactNode
    collapsedId: CollapsedEnum
    parentCollapsedId: CollapsedEnum
}) {
    const { children, name, icon, collapsedId, parentCollapsedId } = props
    const { t } = useTranslations()

    const collapsed = useGameStore(isCollapsed(collapsedId))
    const parentCollapsed = useUiTempStore(getSidebarWidth(parentCollapsedId)) < 240
    const collapseClick = useCallback(() => collapse(collapsedId), [collapsedId])

    const [created, setCreated] = useState(false)
    useLayoutEffect(() => {
        const timeout = setTimeout(() => setCreated(true), 100)
        return () => clearTimeout(timeout)
    }, [])

    return (
        <Collapsible open={!collapsed}>
            <MyListItem
                collapsedId={parentCollapsedId}
                active={false}
                text={t[name]}
                icon={icon}
                arrowOpen={collapsed}
                onClick={collapseClick}
            />
            <CollapsibleContent className="CollapsibleContent">
                <div className={clsx(created ? classes.myListTransition : '', { 'pl-4': !parentCollapsed })}>
                    {children}
                </div>
            </CollapsibleContent>
        </Collapsible>
    )
})
