import { memo, ReactNode, useCallback, useState } from 'react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../components/ui/hover-card'

export const MyHoverCard = memo(function MyHoverCard(props: { children: ReactNode; trigger: ReactNode }) {
    const { children, trigger } = props
    const [open, setOpen] = useState(false)

    const onClick = useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen])
    const onFocus = useCallback(() => setTimeout(() => setOpen(true), 0), [setOpen])
    const onBlur = useCallback(() => setOpen(false), [setOpen])

    return (
        <HoverCard open={open} onOpenChange={setOpen}>
            <HoverCardTrigger onClick={onClick} onFocus={onFocus} onBlur={onBlur}>
                {trigger}
            </HoverCardTrigger>
            <HoverCardContent>{children}</HoverCardContent>
        </HoverCard>
    )
})
