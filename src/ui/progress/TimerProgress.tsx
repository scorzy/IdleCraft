import './progress.css'

import { memo, useCallback, useLayoutEffect, useRef } from 'react'
import { useGameStore } from '../../game/state'
import { Colors } from '../state/uiFunctions'
import { GameState } from '../../game/GameState'
import { usePageVisibility } from './usePageVisibility'
import styles from './timerProgress.module.css'

const TimerProgress = memo(function TimerProgress(props: {
    className?: string
    start: number | undefined
    end: number | undefined
    color: Colors
}) {
    const { className, start, end, color } = props
    const inputEl = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        if (!inputEl.current) return
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
})

const TimerProgressFix = memo(function TimerProgressFix(props: {
    className?: string
    start: number | undefined
    end: number | undefined
    color: Colors
}) {
    const { className, start, end, color } = props
    const v = usePageVisibility()

    const key = (start?.toString() ?? '') + (end?.toString() ?? '') + v.toString()
    return <TimerProgress className={className} start={start} end={end} key={key} color={color} />
})

export const GameTimerProgress = memo(function GameTimerProgress(props: {
    className?: string
    actionId?: string | null
    color: Colors
}) {
    const { className, actionId, color } = props

    const timer = useGameStore(
        useCallback(
            (s: GameState) =>
                actionId ? Object.entries(s.timers.entries).find((kv) => kv[1].actId === actionId)?.[1] : null,
            [actionId]
        )
    )

    return <TimerProgressFix className={className} start={timer?.from} end={timer?.to} key={timer?.id} color={color} />
})

export const TimerProgressFromId = memo(function TimerProgressFromId(props: {
    className?: string
    timerId?: string
    color: Colors
}) {
    const { className, timerId, color } = props

    const timer = useGameStore(
        useCallback((s: GameState) => (timerId !== undefined ? s.timers.entries[timerId] : undefined), [timerId])
    )

    return <TimerProgressFix className={className} start={timer?.from} end={timer?.to} key={timerId} color={color} />
})
