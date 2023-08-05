import classes from './menuItem.module.css'

import { ReactNode, memo } from 'react'
import { useGameStore } from '../../game/state'
import { useTranslations } from '../../msg/useTranslations'
import { UiPages } from '../state/UiPages'
import { UiPagesData } from '../state/UiPagesData'
import { setPage } from '../state/uiFunctions'
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'

export function MenuItem(props: { page: UiPages }) {
    const { page } = props
    const t = useTranslations()
    const data = UiPagesData[page]
    const active = useGameStore((s) => s.ui.page === page)
    return <MyListItem onClick={() => setPage(page)} text={data.getText(t)} active={active} icon={data.icon} />
}
export const MyListItem = memo(function MyListItem(props: {
    active: boolean
    text: string
    onClick: () => void
    icon?: ReactNode
}) {
    const { text, onClick, active, icon } = props
    return (
        <ListItem disablePadding onClick={onClick} className={classes.item}>
            <ListItemButton selected={active}>
                <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
                <ListItemText primary={text} className={classes.text} disableTypography />
            </ListItemButton>
        </ListItem>
    )
})
