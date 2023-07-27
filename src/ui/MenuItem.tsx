import { useGameStore } from '../game/state'
import { UiPages } from './state/UiPages'
import { setPage } from './state/uiFunctions'
import ListItemButton from '@mui/joy/ListItemButton'
import ListItemDecorator from '@mui/joy/ListItemDecorator'
import ListItemContent from '@mui/joy/ListItemContent'
import { ReactNode, memo } from 'react'
import ListItem from '@mui/joy/ListItem'
import { UiPagesData } from './state/UiPagesData'
import { useTranslations } from '../msg/useTranslations'

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
        <ListItem>
            <ListItemButton
                onClick={onClick}
                color={active ? 'primary' : 'neutral'}
                variant={active ? 'soft' : 'plain'}
                selected={active}
            >
                <ListItemDecorator>{icon}</ListItemDecorator>
                <ListItemContent>{text}</ListItemContent>
            </ListItemButton>
        </ListItem>
    )
})
