import { ReactNode, memo } from 'react'
import { CardHeader, CardTitle } from '@/components/ui/card'

export const MyCardHeaderTitle = memo(function MyCardHeaderTitle(props: {
    title?: string
    icon?: ReactNode
    rightSlot?: ReactNode
    onClick?: () => void
}) {
    const { title, icon, rightSlot, onClick } = props

    return (
        <CardHeader>
            <CardTitle onClick={onClick}>
                {icon && <span className="text-lg">{icon}</span>} {title} {rightSlot}
            </CardTitle>
        </CardHeader>
    )
})
