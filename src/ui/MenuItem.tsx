import clsx from 'clsx'
import { useGameStore } from '../game/state'
import { UiPages } from './state/UiPages'
import { setPage } from './state/uiFunctions'

export function MenuItem(props: { text: string; page: UiPages }) {
    const { text, page } = props
    const active = useGameStore((s) => s.ui.page === page)
    return (
        <li className={clsx('menu-item', { 'menu-item__active': active })} onClick={() => setPage(page)}>
            <a href="javascript:void(0);">{text}</a>
        </li>
    )
}
