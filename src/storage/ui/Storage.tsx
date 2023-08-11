import { useGameStore } from '../../game/state'
import { GameLocations } from '../../gameLocations/GameLocations'
import { selectItem, selectItemQta, selectLocationItems, selectStorageLocations } from '../StorageSelectors'
import { Page } from '../../ui/shell/AppShell'
import List from '@mui/material/List'
import { Collapse, Divider, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { memo, useCallback, useState } from 'react'
import { MyCard } from '../../ui/myCard/myCard'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { IconsData } from '../../icons/Icons'
import classes from './storage.module.css'
import { getItemId2, setSelectedItem } from '../storageFunctions'
import { SelectedItem } from '../../items/ui/SelectedItem'
import { useTranslations } from '../../msg/useTranslations'

export function UiStorage() {
    const locations = useGameStore(selectStorageLocations)

    return (
        <Page>
            <div className="my-container">
                <MyCard>
                    {locations.map((l) => (
                        <LocationStorage key={l} location={GameLocations.StartVillage} />
                    ))}
                </MyCard>
                <SelectedItem />
            </div>
        </Page>
    )
}
const LocationStorage = memo(function LocationStorage(props: { location: GameLocations }) {
    const { location } = props
    const items = useGameStore(selectLocationItems(location))
    const [open, setOpen] = useState(true)
    const handleClick = () => setOpen(!open)
    const len = items.length

    return (
        <List dense component="div">
            <ListItemButton onClick={handleClick}>
                {/* <ListItemIcon></ListItemIcon> */}
                <ListItemText primary={location} disableTypography />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={open} timeout="auto" unmountOnExit>
                <List dense component="div" disablePadding>
                    {items.map((i, index) => (
                        <StorageItem
                            key={getItemId2(i.stdItemId, i.craftItemId)}
                            isLast={index >= len - 1}
                            stdItemId={i.stdItemId}
                            craftItemId={i.craftItemId}
                            location={location}
                        />
                    ))}
                </List>
            </Collapse>
        </List>
    )
})

const StorageItem = memo(function StorageItem(props: {
    isLast: boolean
    location: GameLocations
    stdItemId: string | null
    craftItemId: string | null
}) {
    const { isLast, location, stdItemId, craftItemId } = props
    const { f } = useNumberFormatter()
    const { t } = useTranslations()
    const qta = useGameStore(selectItemQta(location, stdItemId, craftItemId))
    const item = useGameStore(selectItem(stdItemId, craftItemId))

    const onClick = useCallback(
        () => setSelectedItem(stdItemId, craftItemId, location),
        [stdItemId, craftItemId, location]
    )

    if (!item) return <></>

    return (
        <>
            <ListItemButton onClick={onClick}>
                <ListItemIcon>{IconsData[item.icon]}</ListItemIcon>
                <ListItemText
                    disableTypography
                    primary={
                        <div className={classes.item}>
                            <span>{t[item.nameId]}</span>
                            <span className="monospace">{f(qta)}</span>
                        </div>
                    }
                />
            </ListItemButton>
            {!isLast && <Divider />}
        </>
    )
})
