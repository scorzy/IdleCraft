import { ReactNode, memo, useCallback } from 'react'
import { useGameStore } from '../../game/state'
import { useTranslations } from '../../msg/useTranslations'
import { UiPages } from '../state/UiPages'
import { UiPagesData } from '../state/UiPagesData'
import { collapse, isCollapsed, setPage } from '../state/uiFunctions'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import classes from './menuItem.module.css'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Collapsible, CollapsibleContent } from '../../components/ui/collapsible'
import { Msg } from '../../msg/Msg'
import clsx from 'clsx'
import { TbChevronRight } from 'react-icons/tb'

export const MenuItem = memo(function MenuItem(props: { page: UiPages }) {
    const { page } = props
    const { t } = useTranslations()
    const data = UiPagesData[page]
    const active = useGameStore((s) => s.ui.page === page)
    const collapsed = useGameStore(isCollapsed('sidebar'))
    const onClick = useCallback(() => setPage(page), [page])

    return <MyListItem onClick={onClick} text={t[data.nameId]} active={active} icon={data.icon} collapsed={collapsed} />
})

export const MyListItem = memo(function MyListItem(props: {
    collapsed: boolean
    active: boolean
    text: string
    onClick?: () => void
    icon: ReactNode
    arrowOpen?: boolean
}) {
    const { text, onClick, active, icon, collapsed, arrowOpen } = props

    if (!collapsed) {
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
    }

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
    id: string
    name: keyof Msg
    icon: ReactNode
    children: ReactNode
}) {
    const { id, children, name, icon } = props
    const collapsed = useGameStore(isCollapsed(id))
    const sideCollapsed = useGameStore(isCollapsed('sidebar'))
    const { t } = useTranslations()
    return (
        <Collapsible open={collapsed}>
            <MyListItem
                collapsed={sideCollapsed}
                active={false}
                text={t[name]}
                icon={icon}
                arrowOpen={collapsed}
                onClick={() => collapse(id)}
            />
            <CollapsibleContent className={clsx({ [classes.collapsibleContent]: true, 'pl-6': !sideCollapsed })}>
                {children}
            </CollapsibleContent>
        </Collapsible>
    )
})
