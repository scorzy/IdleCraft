import { ReactNode, memo, useCallback, useState } from 'react'
import { HoverCardTrigger } from '@radix-ui/react-hover-card'
import * as HoverCardPrimitive from '@radix-ui/react-hover-card'
import { HoverCard, HoverCardContent } from '../components/ui/hover-card'

export const MyHoverCard = memo(function MyHoverCard(props: { children: ReactNode; trigger: ReactNode }) {
    const { children, trigger } = props
    const [open, setOpen] = useState(false)

    const onClick = useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen])
    const onFocus = useCallback(() => setTimeout(() => setOpen(true), 0), [setOpen])
    const onBlur = useCallback(() => setOpen(false), [setOpen])

    return (
        <HoverCard open={open} onOpenChange={setOpen} openDelay={500}>
            <HoverCardTrigger onClick={onClick} onFocus={onFocus} onBlur={onBlur}>
                {trigger}
            </HoverCardTrigger>
            <HoverCardPrimitive.Portal>
                <HoverCardContent>{children}</HoverCardContent>
            </HoverCardPrimitive.Portal>
        </HoverCard>
    )
})
