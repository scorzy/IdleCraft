import { ReactNode, memo } from 'react'
import { clsx } from 'clsx'
import classes from './myCard.module.css'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export const MyCardLabel = memo(function MyCardLabel(props: { children?: ReactNode }) {
    const { children } = props

    return <span className="my-card-label">{children}</span>
})

export const MyCard = memo(function MyCard(props: {
    children?: ReactNode
    title?: string
    actions?: ReactNode
    icon?: ReactNode
    className?: string
}) {
    const { children, title, actions, icon, className } = props

    return (
        <Card className={`my-card ${title ? '' : 'pt-4'}${className ? ` ${className}` : ''}`}>
            {title && (
                <CardHeader>
                    <CardTitle>
                        {icon} <span>{title}</span>
                    </CardTitle>
                </CardHeader>
            )}
            <CardContent>{children}</CardContent>
            {actions && <CardFooter>{actions}</CardFooter>}
        </Card>
    )
})
export const SmallCard = memo(function SmallCard(props: { children?: ReactNode; className?: string }) {
    const { children, className } = props
    return <Card className={clsx(classes.smallCard, className)}>{children}</Card>
})
