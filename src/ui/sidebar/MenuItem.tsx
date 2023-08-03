import { ReactNode, memo } from 'react'
import clsx from 'clsx'
import { useGameStore } from '../../game/state'
import { useTranslations } from '../../msg/useTranslations'
import { UiPages } from '../state/UiPages'
import { UiPagesData } from '../state/UiPagesData'
import { setPage } from '../state/uiFunctions'

export function MenuItem(props: { page: UiPages }) {
    const { page } = props
    const t = useTranslations()
    const data = UiPagesData[page]
    const active = useGameStore((s) => s.ui.page === page)
    return <MyListItem onClick={() => setPage(page)} text={data.getText(t)} active={active} icon={data.icon} />
}
export const MyListItem = memo((props: { active: boolean; text: string; onClick: () => void; icon?: ReactNode }) => {
    const { text, onClick, active, icon } = props
    return (
        <a
            onClick={onClick}
            className={clsx('theme menu-item', { neutral: !active }, { 'menu-item__active primary': active })}
        >
            {icon}
            {text}
        </a>
    )
})
