import { ReactNode, memo } from 'react'
import classes from './myCard.module.css'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import { GiDeadWood } from 'react-icons/gi'

export const MyCardTitle = memo((props: { title: string }) => {
    const { title } = props

    return (
        <Typography variant="h5" gutterBottom>
            <GiDeadWood /> {title}
        </Typography>
    )
})
MyCardTitle.displayName = 'MyCardTitle'

export const MyCardLabel = memo((props: { children: ReactNode }) => {
    const { children } = props

    return <Typography variant="body1">{children}</Typography>
})
MyCardLabel.displayName = 'MyCardLabel'

export const MyCard = memo((props: { children?: ReactNode; title?: string; actions?: ReactNode }) => {
    const { children, title, actions } = props

    return (
        <Card variant="outlined">
            <CardContent>
                {title && <MyCardTitle title={title} />}
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
MyCard.displayName = 'MyCard'
