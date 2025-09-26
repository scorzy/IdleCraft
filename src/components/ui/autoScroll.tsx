import { useRef, useEffect, JSX } from 'react'
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
    const virtualizer = useVirtualizer({
        count: totalCount,
        getScrollElement: () => parentRef.current,
        estimateSize,
        overscan: 5,
    })

    //Auto-scroll to bottom when new items are added
    useEffect(() => {
        if (autoscroll && parentRef.current) parentRef.current.scrollTop = parentRef.current.scrollHeight
    }, [lastId, autoscroll])

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
