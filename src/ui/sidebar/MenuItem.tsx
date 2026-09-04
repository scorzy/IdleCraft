import { clsx } from 'clsx'
import { memo, ReactNode, useCallback, useLayoutEffect, useState } from 'react'
import { TbChevronRight } from 'react-icons/tb'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Collapsible, CollapsibleContent } from '../../components/ui/collapsible'
import { useGameStore } from '../../game/state'
import { Msg } from '../../msg/Msg'
import { useTranslations } from '../../msg/useTranslations'
import { UiPages } from '../state/UiPages'
import { UiPagesData } from '../state/UiPagesData'
import { collapse, setPage } from '../state/uiFunctions'
import { lockedIcon } from '../state/uiFunctions'
import { selectPageUnlocked } from '../state/pageUnlocks'
import { getSidebarWidth, isCollapsed } from '../state/uiSelectors'
import { useUiTempStore } from '../state/uiTempStore'
import { CollapsedEnum } from './CollapsedEnum'
import classes from './menuItem.module.css'

export const MenuItem = memo(function MenuItem(props: {
    page: UiPages
    right?: ReactNode
    collapsedId: CollapsedEnum
}) {
    const { page, collapsedId, right } = props
    const { t } = useTranslations()
    const data = UiPagesData[page]
    const active = useGameStore((s) => s.ui.page === page)
    const unlocked = useGameStore(selectPageUnlocked(page))
    const onClick = useCallback(() => setPage(page), [page])

    return (
        <MyListItem
            onClick={onClick}
            text={unlocked ? t[data.nameId] : t.Locked}
            active={active}
            icon={lockedIcon(data.icon, unlocked)}
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

    if (!collapsed || text === '')
        return (
            <MyListItemBtn
                active={active}
                text={text}
                icon={icon}
                onClick={onClick}
                arrowOpen={arrowOpen}
                right={right}
                enabled={enabled}
            />
        )
    else return <MyListItemBtnTooltip active={active} text={text} onClick={onClick} icon={icon} collapsed={collapsed} />
})

const MyListItemBtn = memo(function MyListItemBtn(props: {
    active: boolean
    text: string
    onClick?: () => void
    icon: ReactNode
    arrowOpen?: boolean
    right?: ReactNode
    enabled: boolean
}) {
    const { text, onClick, active, icon, arrowOpen, right } = props

    let arrow = <></>
    if (arrowOpen !== undefined)
        arrow = <TbChevronRight className={clsx(classes.arrow, { [classes.arrowDown!]: arrowOpen })} />

    return (
        <button
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
            <div className={classes.itemText}>{text}</div>
            {right}
            {arrow}
        </button>
    )
})

const MyListItemBtnTooltip = memo(function MyListItemBtnTooltip({
    active,
    text,
    onClick,
    icon,
    collapsed,
}: {
    active: boolean
    text: string
    onClick?: () => void
    icon: ReactNode
    collapsed: boolean
}) {
    return (
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
                <div className={clsx({ [classes.myListTransition!]: created }, 'CollapsibleMenu__Items')}>
                    {children}
                </div>
            </CollapsibleContent>
        </Collapsible>
    )
})
