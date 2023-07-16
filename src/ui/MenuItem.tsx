import clsx from 'clsx'

export function MenuItem(props: { text: string; active?: boolean }) {
    const { text, active } = props
    return (
        <li className={clsx('menu-item', { 'menu-item__active': active })}>
            <a href="#">{text}</a>
        </li>
    )
}
