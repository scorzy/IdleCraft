import { useRef, useEffect, useLayoutEffect, useState, JSX } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { cn } from '../../lib/utils'
import classes from './autoScroll.module.css'

export const AutoScroll = ({
    totalCount,
    itemContent,
    className,
    autoscroll,
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
    const prevScrollHeight = useRef<number>(0)
    const [wasAtBottom, setWasAtBottom] = useState(true)

    const virtualizer = useVirtualizer({
        count: totalCount,
        getScrollElement: () => parentRef.current,
        estimateSize,
        overscan: 5,
    })

    // Track if user was at bottom before update
    useLayoutEffect(() => {
        const el = parentRef.current
        if (!el) return
        // Allow a small threshold for "at bottom"
        const threshold = 2
        setWasAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < threshold)
        prevScrollHeight.current = el.scrollHeight
    }, [lastId, totalCount, virtualizer.getTotalSize()])

    // Scroll to bottom only if user was at bottom before update
    useEffect(() => {
        const el = parentRef.current
        if (!el) return
        if (autoscroll && wasAtBottom) {
            el.scrollTop = el.scrollHeight
        }
    }, [lastId, autoscroll, wasAtBottom, virtualizer.getTotalSize()])

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
