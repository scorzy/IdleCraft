import { useGameStore } from '../../game/state'
import { GameLocations } from '../../gameLocations/GameLocations'
import {
    selectGameItem,
    selectItemQta,
    selectLocationItems,
    selectStorageLocations,
    isSelected,
} from '../StorageSelectors'
import { Page } from '../../ui/shell/AppShell'
import { memo, useCallback, useState } from 'react'
import { MyCard } from '../../ui/myCard/myCard'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { IconsData } from '../../icons/Icons'
import { getItemId2, setSelectedItem } from '../storageFunctions'
import { SelectedItem } from '../../items/ui/SelectedItem'
import { useTranslations } from '../../msg/useTranslations'
import { buttonVariants } from '../../components/ui/button'
import { cn } from '../../lib/utils'
import { LuChevronsUpDown, LuInfo } from 'react-icons/lu'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { setStorageOrder } from '../../ui/state/uiFunctions'
import { LuArrowDown, LuArrowUp } from 'react-icons/lu'
import classes from './storage.module.css'

export function UiStorage() {
    const locations = useGameStore(selectStorageLocations)

    if (locations.length === 0) return <NoItems />

    return (
        <Page>
            <div className="my-container">
                <MyCard className="fixed-height-2">
                    <SortDropdown />
                    {locations.map((l) => (
                        <LocationStorage key={l} location={GameLocations.StartVillage} />
                    ))}
                </MyCard>
                <SelectedItem />
            </div>
        </Page>
    )
}
const SortDropdown = memo(function SortDropdown() {
    const { t } = useTranslations()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={buttonVariants({ variant: 'secondary' })}>{t.Sort}</DropdownMenuTrigger>
            <DropdownMenuContent className={`sort ${classes.dropDown!}`}>
                <DropdownMenuItem onClick={setStorageOrder('name', true)}>
                    {t.Name} <LuArrowDown />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={setStorageOrder('quantity', true)}>
                    {t.Quantity} <LuArrowDown />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={setStorageOrder('value', true)}>
                    {t.Value} <LuArrowDown />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={setStorageOrder('name', false)}>
                    {t.Name} <LuArrowUp />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={setStorageOrder('quantity', false)}>
                    {t.Quantity} <LuArrowUp />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={setStorageOrder('value', false)}>
                    {t.Value} <LuArrowUp />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
})

const NoItems = memo(function NoItems() {
    const { t } = useTranslations()
    return (
        <Page>
            <div className="my-container">
                <Alert variant="primary">
                    <LuInfo />
                    <AlertTitle>{t.NoItems}</AlertTitle>
                </Alert>
            </div>
        </Page>
    )
})

const LocationStorage = memo(function LocationStorage(props: { location: GameLocations }) {
    const { location } = props
    const items = useGameStore(selectLocationItems(location))
    const [open, setOpen] = useState(true)
    const handleClick = () => setOpen(!open)
    const len = items.length

    return (
        <Collapsible open={open}>
            <CollapsibleTrigger onClick={handleClick} className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                {location}
                <LuChevronsUpDown className="h-4 w-4 ml-2" />
                <span className="sr-only">{location}</span>
            </CollapsibleTrigger>
            <CollapsibleContent>
                {items.map((i, index) => (
                    <StorageItem
                        key={getItemId2(i.stdItemId, i.craftItemId)}
                        isLast={index >= len - 1}
                        stdItemId={i.stdItemId}
                        craftItemId={i.craftItemId}
                        location={location}
                    />
                ))}
            </CollapsibleContent>
        </Collapsible>
    )
})

const StorageItem = memo(function StorageItem(props: {
    isLast: boolean
    location: GameLocations
    stdItemId: string | null
    craftItemId: string | null
}) {
    const { location, stdItemId, craftItemId, isLast } = props
    const { f } = useNumberFormatter()
    const { t } = useTranslations()
    const qta = useGameStore(selectItemQta(location, stdItemId, craftItemId))
    const item = useGameStore(selectGameItem(stdItemId, craftItemId))
    const selected = useGameStore(isSelected(stdItemId, craftItemId))

    const onClick = useCallback(
        () => setSelectedItem(stdItemId, craftItemId, location),
        [stdItemId, craftItemId, location]
    )

    if (!item) return <></>

    return (
        <>
            <button
                onClick={onClick}
                className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'w-full justify-start gap-4 font-normal',
                    selected ? 'bg-muted' : '',
                    classes.item
                )}
            >
                {IconsData[item.icon]}
                <span className="justify-self-start">{t[item.nameId]}</span>
                <span>{f(qta)}</span>
                <span>{f(item.value)}</span>
            </button>

            {!isLast && <hr className={classes.hr} />}
        </>
    )
})
