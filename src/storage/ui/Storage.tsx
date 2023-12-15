import { memo, useCallback, useState } from 'react'
import { LuChevronsUpDown, LuInfo, LuArrowDown, LuArrowUp } from 'react-icons/lu'
import { clsx } from 'clsx'
import { useContainerQueries, QueryBreakpoints } from 'use-container-queries'
import { useGameStore } from '../../game/state'
import { GameLocations } from '../../gameLocations/GameLocations'
import {
    selectGameItem,
    selectItemQta,
    selectLocationItems,
    selectStorageLocations,
    isSelected,
} from '../StorageSelectors'
import { MyCard } from '../../ui/myCard/myCard'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { IconsData } from '../../icons/Icons'
import { getItemId2, setSelectedItem } from '../storageFunctions'
import { SelectedItem } from '../../items/ui/SelectedItem'
import { useTranslations } from '../../msg/useTranslations'
import { buttonVariants } from '../../components/ui/button'
import { cn } from '../../lib/utils'
import { setStorageOrder } from '../../ui/state/uiFunctions'
import { MyPage } from '../../ui/pages/MyPage'
import classes from './storage.module.css'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function UiStorage() {
    const locations = useGameStore(selectStorageLocations)

    if (locations.length === 0) return <NoItems />

    return (
        <MyPage>
            <div className={classes.cardList}>
                <MyCard>
                    <SortDropdown />
                    {locations.map((l) => (
                        <LocationStorage key={l} location={GameLocations.StartVillage} />
                    ))}
                </MyCard>
                <SelectedItem />
            </div>
        </MyPage>
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
        <MyPage>
            <div className="my-container">
                <Alert variant="primary">
                    <LuInfo />
                    <AlertTitle>{t.NoItems}</AlertTitle>
                </Alert>
            </div>
        </MyPage>
    )
})

const breakpoints: QueryBreakpoints = {
    small: [0, 400],
    med: [401],
}

const LocationStorage = memo(function LocationStorage(props: { location: GameLocations }) {
    const { location } = props
    const items = useGameStore(selectLocationItems(location))
    const [open, setOpen] = useState(true)
    const handleClick = () => setOpen(!open)
    const len = items.length
    const { ref, active } = useContainerQueries({ breakpoints })

    return (
        <Collapsible open={open} ref={ref}>
            <CollapsibleTrigger
                onClick={handleClick}
                className={clsx('w-full', buttonVariants({ variant: 'ghost', size: 'sm' }))}
            >
                {location}
                <LuChevronsUpDown className="h-4 ml-2" />
                <span className="sr-only">{location}</span>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <Table>
                    {active === 'med' && (
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-7"></TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="w-20 text-right">Quantity</TableHead>
                                <TableHead className="w-20 text-right">Value</TableHead>
                            </TableRow>
                        </TableHeader>
                    )}
                    <TableBody>
                        {items.map((i, index) => (
                            <StorageItem
                                small={active === 'small'}
                                key={getItemId2(i.stdItemId, i.craftItemId)}
                                isLast={index >= len - 1}
                                stdItemId={i.stdItemId}
                                craftItemId={i.craftItemId}
                                location={location}
                            />
                        ))}
                    </TableBody>
                </Table>
            </CollapsibleContent>
        </Collapsible>
    )
})

const StorageItem = memo(function StorageItem(props: {
    isLast: boolean
    small: boolean
    location: GameLocations
    stdItemId: string | null
    craftItemId: string | null
}) {
    const { location, stdItemId, craftItemId, small } = props
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

    if (small)
        return (
            <TableRow onClick={onClick} className={cn(classes.row, { 'bg-muted': selected })}>
                <TableCell>
                    <span className={classes.smallRow}>
                        {IconsData[item.icon]}
                        <span>{t[item.nameId]}</span>
                    </span>
                    <span className={classes.smallRow}>
                        <span className="text-left align-middle font-medium text-muted-foreground">Quantity</span>
                        {f(qta)}
                    </span>
                    <span className={classes.smallRow}>
                        <span className="text-left align-middle font-medium text-muted-foreground">Value</span>
                        {f(item.value)}
                    </span>
                </TableCell>
            </TableRow>
        )
    else
        return (
            <TableRow onClick={onClick} className={cn(classes.row, { 'bg-muted': selected })}>
                <TableCell>{IconsData[item.icon]}</TableCell>
                <TableCell>{t[item.nameId]}</TableCell>
                <TableCell className="text-right">{f(qta)}</TableCell>
                <TableCell className="text-right">{f(item.value)}</TableCell>
            </TableRow>
        )
})
