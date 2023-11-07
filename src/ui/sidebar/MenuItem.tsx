import { ReactNode, memo, useCallback } from 'react'
import { useGameStore } from '../../game/state'
import { useTranslations } from '../../msg/useTranslations'
import { UiPages } from '../state/UiPages'
import { UiPagesData } from '../state/UiPagesData'
import { setPage } from '../state/uiFunctions'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import classes from './menuItem.module.css'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Collapsible, CollapsibleContent } from '../../components/ui/collapsible'
import { Msg } from '../../msg/Msg'
import clsx from 'clsx'
import { TbChevronRight } from 'react-icons/tb'
import { useMediaQuery } from 'usehooks-ts'

export const MenuItem = memo(function MenuItem(props: { page: UiPages; parentCollapsed: boolean }) {
    const { page, parentCollapsed } = props
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
}) {
    const { text, onClick, active, icon, arrowOpen } = props
    let { collapsed } = props
    const matches = useMediaQuery('(min-width: 900px)')

    if (!matches) collapsed = false
    if (!collapsed || text === '' || !matches) {
        let arrow = <></>
        if (arrowOpen !== undefined)
            arrow = <TbChevronRight className={clsx({ [classes.arrow]: true, [classes.arrowDown]: arrowOpen })} />

        return (
            <button
                onClick={onClick}
                className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    active ? 'bg-muted hover:bg-muted' : 'hover:bg-muted ',
                    'justify-start gap-4',
                    classes.item,
                    collapsed ? classes.itemCollapsed : ''
                )}
            >
                {icon}
                {text}
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
                            active ? 'bg-muted hover:bg-muted' : 'hover:bg-muted ',
                            'justify-start gap-4',
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
    collapsed: boolean
    parentCollapsed: boolean
    name: keyof Msg
    icon: ReactNode
    children: ReactNode
    collapseClick: () => void
}) {
    const { collapsed, children, name, icon, collapseClick, parentCollapsed } = props
    const { t } = useTranslations()
    return (
        <Collapsible open={collapsed}>
            <MyListItem
                collapsed={parentCollapsed}
                active={false}
                text={t[name]}
                icon={icon}
                arrowOpen={collapsed}
                onClick={collapseClick}
            />
            <CollapsibleContent>{children}</CollapsibleContent>
        </Collapsible>
    )
})
