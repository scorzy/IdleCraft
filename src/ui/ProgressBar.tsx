import './progress.css'

import { memo } from 'react'
import * as Progress from '@radix-ui/react-progress'
import { Colors, getColorClass } from './state/uiFunctions'

export const ProgressBar = memo((props: { value: number; className?: string; color: Colors }) => {
    const { value, className, color } = props
    const classes = className === undefined ? '' : className
    const progress = -100 + value

    return (
        <Progress.Root className={`progress__root  ${classes} ${getColorClass(color)}`} value={value}>
            <Progress.Indicator
                className="progress__bar"
                style={{
                    transform: `translateX(${progress}%)`,
                }}
            />
        </Progress.Root>
    )
})
ProgressBar.displayName = 'ProgressBar'
