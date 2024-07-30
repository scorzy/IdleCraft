import { ReactNode, memo } from 'react'
import { clsx } from 'clsx'
import './myPage.css'

export const MyPage = memo(function MyPage(props: { children: ReactNode; className?: string }) {
    const { children, className } = props
    return (
        <main className={clsx('page__container')}>
            <div className={clsx('p-4', className)}>{children}</div>
        </main>
    )
})

export const MyPageAll = memo(function MyPageAll(props: {
    children: ReactNode
    sidebar?: ReactNode
    info?: ReactNode
}) {
    const { children, sidebar, info } = props
    return (
        <div className="page__container-sidebar">
            <div className="page__all">
                {info && <div className="page__info-side">{info}</div>}
                {sidebar && <div className="page__sidebar">{sidebar}</div>}
                <div className="page__main2">{children}</div>
            </div>
        </div>
    )
})
