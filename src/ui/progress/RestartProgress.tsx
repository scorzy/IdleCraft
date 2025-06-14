import { useState, useRef, useEffect } from 'react'
import { Colors } from '../state/uiFunctions'
import { ProgressBar } from './ProgressBar'

export function RestartProgress(props: { value: number; className?: string; color: Colors }) {
    const { value: hpPercent, className, color } = props
    const [isZero, setIsZero] = useState(false)
    const prevHpPercentRef = useRef<number>(100)

    useEffect(() => {
        let frame = -1

        if (hpPercent === 100 && hpPercent > prevHpPercentRef.current) {
            setIsZero(true)

            frame = window.setTimeout(() => {
                setIsZero(false)
            }, 200)
        }
        prevHpPercentRef.current = hpPercent
        return () => {
            if (frame !== -1) {
                setIsZero(false)
                window.clearTimeout(frame)
            }
        }
    }, [hpPercent])

    return <ProgressBar value={isZero && hpPercent === 100 ? 0 : hpPercent} className={className} color={color} />
}
