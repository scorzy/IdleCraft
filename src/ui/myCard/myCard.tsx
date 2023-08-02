import { ReactNode, memo } from 'react'
import classes from './myCard.module.css'

export const MyCardTitle = memo((props: { title: string }) => {
    const { title } = props

    return <h2 className={classes.title}>{title}</h2>
})
MyCardTitle.displayName = 'MyCardTitle'

export function MyCardLabel(props: { children: ReactNode }) {
    const { children } = props

    return <h3 className={classes.label}>{children}</h3>
}
