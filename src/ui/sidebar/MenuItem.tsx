import { ReactNode, memo, useCallback } from 'react'
import { useGameStore } from '../../game/state'
import { useTranslations } from '../../msg/useTranslations'
import { UiPages } from '../state/UiPages'
import { UiPagesData } from '../state/UiPagesData'
import { isCollapsed, setPage } from '../state/uiFunctions'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import classes from './menuItem.module.css'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

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
    onClick: () => void
    icon?: ReactNode
}) {
    const { text, onClick, active, icon, collapsed } = props

    if (!collapsed)
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
            </button>
        )

    return (
        <TooltipProvider delayDuration={150}>
            <Tooltip>
                <TooltipTrigger
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
                </TooltipTrigger>
                <TooltipContent side="right">{text}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
})
