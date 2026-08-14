import { memo, useEffect, useState } from 'react'
import { useTranslations } from '../../msg/useTranslations'

export const TimeRemainingUi = memo(function TimeRemainingUi({ arriveAtMs }: { arriveAtMs: number }) {
    const { t, fun } = useTranslations()
    const [now, setNow] = useState(() => Date.now())

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000)
        return () => clearInterval(interval)
    }, [])

    const remainingMs = arriveAtMs - now
    if (remainingMs <= 0) return <>{t.Arrived}</>
    return <>{fun.formatTime(remainingMs)}</>
})
