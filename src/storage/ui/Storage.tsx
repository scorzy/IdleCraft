import { memo, useCallback, useState } from 'react'
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
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { IconsData } from '../../icons/Icons'
import { getItemId2, setSelectedItem } from '../storageFunctions'
import { SelectedItem } from '../../items/ui/SelectedItem'
import { useTranslations } from '../../msg/useTranslations'
import { Button, buttonVariants } from '../../components/ui/button'
import { cn } from '../../lib/utils'
import { clickStorageHeader, setStorageOrder } from '../../ui/state/uiFunctions'
import { MyPage } from '../../ui/pages/MyPage'
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon, InfoIcon } from '../../icons/IconsMemo'
import { Card, CardContent } from '../../components/ui/card'
import {
    selectIsStorageOrderName,
    selectIsStorageOrderQuantity,
    selectIsStorageOrderValue,
    selectStorageAsc,
} from '../../ui/state/uiSelectors'
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
                <Card>
                    <CardContent>
                        <SortDropdown />
                        {locations.map((l) => (
                            <LocationStorage key={l} location={GameLocations.StartVillage} />
                        ))}
                    </CardContent>
                </Card>
                <SelectedItem />
            </div>
        </MyPage>
    )
}

const NoItems = memo(function NoItems() {
    const { t } = useTranslations()
    return (
        <MyPage>
            <div className="my-container">
                <Alert variant="primary">
                    {InfoIcon}
                    <AlertTitle>{t.NoItems}</AlertTitle>
                </Alert>
            </div>
        </MyPage>
    )
})

const clickNameAsc = setStorageOrder('name', true)
const clickNameDesc = setStorageOrder('name', false)

const clickValueAsc = setStorageOrder('value', true)
const clickValueDesc = setStorageOrder('value', false)

const clickQuantityAsc = setStorageOrder('quantity', true)
const clickQuantityDesc = setStorageOrder('quantity', false)

const SortDropdown = memo(function SortDropdown() {
    const { t } = useTranslations()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={buttonVariants({ variant: 'secondary' })}>{t.Sort}</DropdownMenuTrigger>
            <DropdownMenuContent className={`sort ${classes.dropDown!}`}>
                <DropdownMenuItem onClick={clickNameAsc}>
                    {t.Name} {ArrowDownIcon}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={clickQuantityAsc}>
                    {t.Quantity} {ArrowDownIcon}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={clickValueAsc}>
                    {t.Value} {ArrowDownIcon}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={clickNameDesc}>
                    {t.Name} {ArrowUpIcon}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={clickQuantityDesc}>
                    {t.Quantity} {ArrowUpIcon}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={clickValueDesc}>
                    {t.Value} {ArrowUpIcon}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
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
    const { ref, active } = useContainerQueries({ breakpoints })

    return (
        <Collapsible open={open} ref={ref}>
            <CollapsibleTrigger
                onClick={handleClick}
                className={clsx('w-full', buttonVariants({ variant: 'ghost', size: 'sm' }))}
            >
                {location}
                {ChevronsUpDownIcon}
                <span className="sr-only">{location}</span>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <Table>
                    {active === 'med' && <StorageHeader />}
                    <TableBody>
                        {items.map((i) => (
                            <StorageItem
                                small={active === 'small'}
                                key={getItemId2(i.stdItemId, i.craftItemId)}
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

const nameClick = clickStorageHeader('name')
const quantityClick = clickStorageHeader('quantity')
const valueClick = clickStorageHeader('value')

const StorageHeader = memo(function StorageHeader() {
    return (
        <TableHeader>
            <TableRow>
                <TableHead className="w-7"></TableHead>
                <StorageHeaderName />
                <StorageHeaderQuantity />
                <StorageHeaderValue />
            </TableRow>
        </TableHeader>
    )
})

const StorageHeaderName = memo(function StorageHeaderName() {
    const order = useGameStore(selectIsStorageOrderName)
    const { t } = useTranslations()
    return (
        <TableHead>
            <Button variant="ghost" size="sm" className="gap-1" onClick={nameClick}>
                {t.Name} {order && <StorageHeaderArrow />}
            </Button>
        </TableHead>
    )
})
const StorageHeaderQuantity = memo(function StorageHeaderQuantity() {
    const order = useGameStore(selectIsStorageOrderQuantity)
    const { t } = useTranslations()
    return (
        <TableHead className="w-28 text-right">
            <Button variant="ghost" size="sm" className="gap-1" onClick={valueClick}>
                {t.Value} {order && <StorageHeaderArrow />}
            </Button>
        </TableHead>
    )
})
const StorageHeaderValue = memo(function StorageHeaderValue() {
    const order = useGameStore(selectIsStorageOrderValue)
    const { t } = useTranslations()
    return (
        <TableHead className="w-28 text-right">
            <Button variant="ghost" size="sm" className="gap-1" onClick={quantityClick}>
                {t.Quantity} {order && <StorageHeaderArrow />}
            </Button>
        </TableHead>
    )
})
const StorageHeaderArrow = memo(function StorageHeaderValue() {
    const asc = useGameStore(selectStorageAsc)
    return asc ? ArrowDownIcon : ArrowUpIcon
})

const StorageItem = memo(function StorageItem(props: {
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

    if (!item) return
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
