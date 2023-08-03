import './progress.css'

import { memo } from 'react'
import { Colors } from '../state/uiFunctions'

export const ProgressBar = memo((props: { value: number; className?: string; color: Colors }) => {
    const { value, className, color } = props
    const classes = className === undefined ? '' : className
    const progress = -100 + value

    return (
        <div className={`theme progress__root ${classes} ${color}`}>
            <div className="progress__bar" style={{ transform: `translateX(${progress}%)` }} />
        </div>
    )
})
ProgressBar.displayName = 'ProgressBar'
