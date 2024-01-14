import { ReactNode, memo, useCallback } from 'react'
import { clsx } from 'clsx'
import { TbChevronRight } from 'react-icons/tb'
import { useMediaQuery } from 'usehooks-ts'
import { useGameStore } from '../../game/state'
import { useTranslations } from '../../msg/useTranslations'
import { UiPages } from '../state/UiPages'
import { UiPagesData } from '../state/UiPagesData'
import { collapse, setPage } from '../state/uiFunctions'
import { Collapsible, CollapsibleContent } from '../../components/ui/collapsible'
import { Msg } from '../../msg/Msg'
import { isCollapsed } from '../state/uiSelectors'
import classes from './menuItem.module.css'
import { CollapsedEnum } from './CollapsedEnum'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export const MenuItem = memo(function MenuItem(props: { page: UiPages; parentCollapsed: boolean; right?: ReactNode }) {
    const { page, parentCollapsed, right } = props
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
            collapsed={parentCollapsed}
            right={right}
        />
    )
})

export const MyListItem = memo(function MyListItem(props: {
    collapsed: boolean
    active: boolean
    text: string
    onClick?: () => void
    icon: ReactNode
    arrowOpen?: boolean
    right?: ReactNode
}) {
    const { text, onClick, active, icon, arrowOpen, right } = props
    let { collapsed } = props
    const matches = useMediaQuery('(min-width: 900px)')

    if (!matches) collapsed = false
    if (!collapsed || text === '' || !matches) {
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
                    { 'hover:bg-muted text-muted-foreground': !active },
                    'justify-start gap-4 mt-1 text-nowrap',
                    classes.item,
                    collapsed ? classes.itemCollapsed : ''
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
                        title={text}
                        className={cn(
                            buttonVariants({ variant: 'ghost' }),
                            { 'bg-muted hover:bg-muted': active },
                            { 'hover:bg-muted text-muted-foreground': !active },
                            'justify-start gap-4 mt-1',
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
    parentCollapsed: boolean
    name: keyof Msg
    icon: ReactNode
    children: ReactNode
    collapsedId: CollapsedEnum
}) {
    const { children, name, icon, parentCollapsed, collapsedId } = props
    const { t } = useTranslations()

    const collapsed = useGameStore(isCollapsed(collapsedId))
    const collapseClick = useCallback(() => collapse(collapsedId), [collapsedId])

    return (
        <Collapsible open={!collapsed}>
            <MyListItem
                collapsed={parentCollapsed}
                active={false}
                text={t[name]}
                icon={icon}
                arrowOpen={collapsed}
                onClick={collapseClick}
            />
            <CollapsibleContent>
                <div className={clsx(classes.myList, { 'pl-4': !parentCollapsed })}>{children}</div>
            </CollapsibleContent>
        </Collapsible>
    )
})
