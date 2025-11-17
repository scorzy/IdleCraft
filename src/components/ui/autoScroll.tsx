import { useRef, useLayoutEffect, useEffect, JSX } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { cn } from '../../lib/utils'
import classes from './autoScroll.module.css'

export const AutoScroll = ({
    totalCount,
    itemContent,
    className,
    autoscroll = true,
    estimateSize,
    lastId,
}: {
    className?: string
    totalCount: number
    estimateSize: (index: number) => number
    itemContent: (index: number) => JSX.Element | null
    autoscroll?: boolean
    lastId?: string
}) => {
    // eslint-disable-next-line react-compiler/react-compiler
    'use no memo'

    const parentRef = useRef<HTMLDivElement>(null)
    const prevWasAtBottomRef = useRef<boolean>(false)
    const prevLastIdRef = useRef<string | undefined>(undefined)

    const virtualizer = useVirtualizer({
        count: totalCount,
        getScrollElement: () => parentRef.current,
        estimateSize,
        overscan: 5,
    })

    // keep `prevWasAtBottomRef` updated from user actions (scroll/resize)
    useEffect(() => {
        const el = parentRef.current
        if (!el) return
        const threshold = 2
        const update = () => {
            prevWasAtBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < threshold
        }
        // initial measurement
        update()
        el.addEventListener('scroll', update, { passive: true })
        window.addEventListener('resize', update)
        return () => {
            el.removeEventListener('scroll', update)
            window.removeEventListener('resize', update)
        }
    }, [])

    // initialize prevLastIdRef whenever lastId changes; do not treat undefined -> defined as "change"
    useEffect(() => {
        prevLastIdRef.current = lastId
    }, [lastId])

    // After DOM updates, decide whether to autoscroll based on the previous "was at bottom" flag.
    useLayoutEffect(() => {
        const el = parentRef.current
        if (!el) return

        const hadPrev = prevLastIdRef.current !== undefined
        const lastIdChanged = hadPrev && prevLastIdRef.current !== lastId
        const wasAtBottomBefore = prevWasAtBottomRef.current

        if (autoscroll && lastIdChanged && wasAtBottomBefore) {
            // scroll to bottom after virtualizer/layout update
            el.scrollTop = el.scrollHeight
        }

        // store current lastId for next comparison (already handled by effect above, but keep for clarity)
        prevLastIdRef.current = lastId
        // Note: do NOT update prevWasAtBottomRef here — it's updated by the scroll handler above
    }, [lastId, autoscroll, virtualizer.getTotalSize(), totalCount])

    return (
        <div ref={parentRef} className={cn(classes.container, className)}>
            <div className={classes.container2} style={{ height: `${virtualizer.getTotalSize()}px` }}>
                {virtualizer.getVirtualItems().map((virtualRow) => (
                    <div
                        key={virtualRow.key}
                        className={classes.row}
                        style={{
                            height: `${virtualRow.size}px`,
                            transform: `translateY(${virtualRow.start}px)`,
                        }}
                    >
                        {itemContent(virtualRow.index)}
                    </div>
                ))}
            </div>
        </div>
    )
}
