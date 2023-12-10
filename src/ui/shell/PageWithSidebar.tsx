import { ReactNode, memo } from 'react'
import classes from './appShell.module.css'

export const PageWithSidebar = memo(function PageWithSidebar(props: { children?: ReactNode; sidebar: ReactNode }) {
    const { children, sidebar } = props
    return (
        <div className={classes.pageWithSide}>
            <div className={classes.side2}>{sidebar}</div>
            <div className={classes.content}>{children}</div>
        </div>
    )
})
