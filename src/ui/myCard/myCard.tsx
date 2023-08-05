import { ReactNode, memo } from 'react'
import classes from './myCard.module.css'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'

export const MyCardTitle = memo(function MyCardLabel(props: { title: string; icon?: ReactNode }) {
    const { title, icon } = props

    return (
        <Typography variant="h5" gutterBottom className={classes.title}>
            {icon} {title}
        </Typography>
    )
})

export const MyCardLabel = memo(function MyCardLabel(props: { children: ReactNode }) {
    const { children } = props

    return <Typography variant="body1">{children}</Typography>
})

export const MyCard = memo(function MyCard(props: {
    children?: ReactNode
    title?: string
    actions?: ReactNode
    icon?: ReactNode
}) {
    const { children, title, actions, icon } = props

    return (
        <Card variant="outlined">
            <CardContent>
                {title && <MyCardTitle title={title} icon={icon} />}
                {children}
            </CardContent>
            {actions && (
                <CardActions disableSpacing className={classes.actions}>
                    {actions}
                </CardActions>
            )}
        </Card>
    )
})
