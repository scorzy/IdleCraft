import { ReactNode, memo } from 'react'
import { cn } from '../../lib/utils'

export const MyLabelContainer = memo(function MyLabelContainer(props: { children: ReactNode; className?: string }) {
    const { children, className } = props
    return <span className={cn('flex flex-wrap gap-2', className)}>{children}</span>
})

export const MyLabel = memo(function MyLabel(props: { children: ReactNode; className?: string }) {
    const { children, className } = props
    return (
        <span className={cn('grid grow basis-0 grid-flow-col items-center justify-start gap-2 text-sm', className)}>
            {children}
        </span>
    )
})
