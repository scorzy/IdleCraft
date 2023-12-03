import { ReactNode } from 'react'
import classes from './contentPage.module.css'

export function ContentPage(props: { children: ReactNode; infoPanel?: ReactNode }) {
    const { children, infoPanel } = props
    return (
        <div className={classes.page}>
            <div className="grid-span-2">{children}</div>
            {infoPanel && <div className={classes.infoPanel}>{infoPanel}</div>}
        </div>
    )
}
