import { ReactNode } from 'react'
import './myPage.css'

export function MyPage(props: { children: ReactNode }) {
    const { children } = props
    return <div className="page__container">{children}</div>
}
