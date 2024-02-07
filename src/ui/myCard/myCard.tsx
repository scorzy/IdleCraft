import { ReactNode, memo } from 'react'
import { CardHeader, CardTitle } from '@/components/ui/card'

export const MyCardHeaderTitle = memo(function MyCardHeaderTitle(props: { title?: string; icon?: ReactNode }) {
    const { title, icon } = props

    return (
        <CardHeader>
            <CardTitle>
                {icon} {title}
            </CardTitle>
        </CardHeader>
    )
})
