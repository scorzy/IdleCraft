import { memo } from 'react'
import { clsx } from 'clsx'
import { Colors } from '../state/uiFunctions'
import './progress.css'

export const ProgressBar = memo(function ProgressBar(props: { value: number; className?: string; color: Colors }) {
    const { value, className, color } = props
    const progress = -100 + value

    return (
        <div className={clsx('progress__root', className, color)}>
            <div className="progress__bar" style={{ transform: `translateX(${progress}%)` }} />
        </div>
    )
})
