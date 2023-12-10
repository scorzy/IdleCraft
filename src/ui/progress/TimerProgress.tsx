import './progress.css'

import { memo, useEffect, useRef } from 'react'
import { useGameStore } from '../../game/state'
import { Colors } from '../state/uiFunctions'
import { usePageVisibility } from './usePageVisibility'
import styles from './timerProgress.module.css'

const TimerProgress = memo(
    (props: { className?: string; start: number | undefined; end: number | undefined; color: Colors }) => {
        const { className, start, end, color } = props

        const inputEl = useRef<HTMLDivElement>(null)

        useEffect(() => {
            if (inputEl.current === null) return
            const now = Date.now()
            const time = end ? end - now : 0
            const progress = start && end ? `${-100 + (100 * (now - start)) / (end - start)}` : '-100'

            inputEl.current.style.setProperty('--timer-progress', `${progress}%`)
            inputEl.current.style.setProperty('--timer-time', `${time}ms`)
        }, [start, end])

        const classes = className ?? ''
        return (
            <div className={`theme progress__root ${classes} ${color}`}>
                {start !== undefined && <div ref={inputEl} className={`progress__bar ${styles.animate}`} />}
            </div>
        )
    }
)
TimerProgress.displayName = 'TimerProgress'

export const TimerProgressFix = (props: {
    className?: string
    start: number | undefined
    end: number | undefined
    color: Colors
}) => {
    const { className, start, end, color } = props
    const v = usePageVisibility()

    const key = (start?.toString() ?? '') + (end?.toString() ?? '') + v.toString()
    return <TimerProgress className={className} start={start} end={end} key={key} color={color} />
}

export const GameTimerProgress = (props: { className?: string; actionId?: string | null; color: Colors }) => {
    const { className, actionId, color } = props

    const timerId = useGameStore((s) => Object.entries(s.timers.entries).find((kv) => kv[1].actId === actionId)?.[0])
    const timer = useGameStore((s) => (timerId !== undefined ? s.timers.entries[timerId] : undefined))

    return <TimerProgressFix className={className} start={timer?.from} end={timer?.to} key={timerId} color={color} />
}
export const TimerProgressFromId = (props: { className?: string; timerId?: string; color: Colors }) => {
    const { className, timerId, color } = props
    const timer = useGameStore((s) => (timerId !== undefined ? s.timers.entries[timerId] : undefined))

    return <TimerProgressFix className={className} start={timer?.from} end={timer?.to} key={timerId} color={color} />
}
