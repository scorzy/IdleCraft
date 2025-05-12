import { memo, useState, useRef, JSX, useLayoutEffect, useCallback } from 'react'
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'

export const AutoScroll = memo(function AutoScroll(props: {
    className?: string
    totalCount: number
    itemContent: (index: number) => JSX.Element | null
}) {
    const { totalCount, itemContent, className } = props
    const [lastVisible, setLastVisible] = useState<boolean>(true)
    const virtuosoRef = useRef<VirtuosoHandle>(null)
    const [visibleRange, setVisibleRange] = useState({
        startIndex: 0,
        endIndex: 0,
    })

    const onScroll = useCallback(
        (e: React.UIEvent<HTMLDivElement>) => {
            const scrollTop = e.currentTarget.scrollTop
            const scrollHeight = e.currentTarget.scrollHeight
            const clientHeight = e.currentTarget.clientHeight
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1
            setLastVisible(isAtBottom)
        },
        [setLastVisible]
    )

    useLayoutEffect(() => {
        let timeout = null
        if (lastVisible && virtuosoRef.current)
            timeout = setTimeout(() => {
                virtuosoRef.current?.scrollToIndex(totalCount)
            }, 0)

        return () => {
            if (timeout) clearTimeout(timeout)
        }
    }, [lastVisible, visibleRange, totalCount])

    return (
        <Virtuoso
            onScroll={onScroll}
            ref={virtuosoRef}
            className={className}
            style={{ height: '100%' }}
            totalCount={totalCount}
            rangeChanged={setVisibleRange}
            itemContent={itemContent}
        />
    )
})
