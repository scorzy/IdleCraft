import { ReactNode, memo } from 'react'
import { cn } from '../../lib/utils'

export const MyLabel = memo(function BonusSpan(props: { children: ReactNode; className?: string }) {
    const { children, className } = props
    return <span className={cn('grid grid-flow-col justify-start gap-2 items-center', className)}>{children}</span>
})
