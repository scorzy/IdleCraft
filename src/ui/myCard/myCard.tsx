import { ReactNode, memo } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export const MyCard = memo(function MyCard(props: {
    children?: ReactNode
    title?: string
    actions?: ReactNode
    icon?: ReactNode
    className?: string
}) {
    const { children, title, actions, icon, className } = props

    return (
        <Card className={className}>
            {title && (
                <CardHeader>
                    <CardTitle>
                        {icon} {title}
                    </CardTitle>
                </CardHeader>
            )}
            <CardContent>{children}</CardContent>
            {actions && <CardFooter>{actions}</CardFooter>}
        </Card>
    )
})
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
