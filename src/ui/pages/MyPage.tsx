import { ReactNode } from 'react'
import './myPage.css'

export function MyPage(props: { children: ReactNode }) {
    const { children } = props
    return <main className="page__container">{children}</main>
}
