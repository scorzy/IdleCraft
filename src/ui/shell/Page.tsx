import { ReactNode, memo } from 'react'
import classes from './appShell.module.css'

export const Page = memo(function PageWithSidebar(props: { children?: ReactNode }) {
    const { children } = props
    return (
        <div className={classes.page}>
            <div className={classes.content}>{children}</div>
        </div>
    )
})
