import classes from './menuItem.module.css'

import { ReactNode, memo, useMemo } from 'react'
import { useGameStore } from '../../game/state'
import { useTranslations } from '../../msg/useTranslations'
import { UiPages } from '../state/UiPages'
import { UiPagesData } from '../state/UiPagesData'
import { setPage } from '../state/uiFunctions'
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material'
import clsx from 'clsx'
import { isCollapsed } from '../state/uiSelectors'

export const MenuItem = memo(function MenuItem(props: { page: UiPages }) {
    const { page } = props
    const { t } = useTranslations()
    const data = UiPagesData[page]
    const active = useGameStore((s) => s.ui.page === page)
    const collapsed = useGameStore(isCollapsed('sidebar'))
    return (
        <MyListItem
            onClick={() => setPage(page)}
            text={data.getText(t)}
            active={active}
            icon={data.icon}
            collapsed={collapsed}
        />
    )
})

export const MyListItem = memo(function MyListItem(props: {
    collapsed: boolean
    active: boolean
    text: string
    onClick: () => void
    icon?: ReactNode
}) {
    const { text, onClick, active, icon, collapsed } = props

    const textItem = useMemo(() => <ListItemText primary={text} className={classes.text} disableTypography />, [text])
    const tooltip = useMemo(
        () => (
            <Tooltip arrow title={text} placement="right">
                <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
            </Tooltip>
        ),
        [text, icon]
    )

    return (
        <ListItem disablePadding onClick={onClick} className={classes.item}>
            <ListItemButton selected={active} className={clsx(classes.btn, { [classes.btnCollapsed]: !collapsed })}>
                {!collapsed && tooltip}
                {collapsed && <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>}
                {textItem}
            </ListItemButton>
        </ListItem>
    )
})
