import React, { memo, useState, useEffect, useRef } from 'react'
import classes from './autoScroll.module.css'

export const AutoScroll = memo(function AutoScroll(props: { className?: string; children: React.ReactNode }) {
    const { children, className } = props
    const lastRef = useRef<HTMLSpanElement>(null)
    const [lastVisible, setLastVisible] = useState<boolean>(true)

    useEffect(() => {
        if (!lastRef.current) return
        if (lastVisible) lastRef.current.scrollIntoView({ behavior: 'smooth' })
    }, [children, lastVisible, lastRef])

    useEffect(() => {
        if (!lastRef.current) return

        const observer = new IntersectionObserver((entries) => {
            let newLastVisible = false
            entries.forEach((entry) => {
                newLastVisible = entry.isIntersecting
            })
            setLastVisible(newLastVisible)
        })
        observer.observe(lastRef.current)

        return () => {
            observer.disconnect()
        }
    }, [lastRef, lastVisible])

    return (
        <div className={className}>
            {children}
            <span ref={lastRef} className={classes.lastSpan}>
                &nbsp;
            </span>
        </div>
    )
})
