import { ReactNode, memo } from 'react'
import { clsx } from 'clsx'
import './myPage.css'

export const MyPage = memo(function MyPage(props: { children: ReactNode; className?: string }) {
    const { children, className } = props
    return <main className={clsx('page__container', className)}>{children}</main>
})

export const MyPageAll = memo(function MyPageAll(props: {
    children: ReactNode
    sidebar?: ReactNode
    header?: ReactNode
}) {
    const { children, sidebar, header } = props
    return (
        <div className="page__container-sidebar">
            <div className="page__all">
                {header && <div className="page__header">{header}</div>}
                {sidebar && <div className="page__sidebar">{sidebar}</div>}
                <div className="page__main2">{children}</div>
            </div>
        </div>
    )
})
