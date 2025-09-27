import { createContext, memo, use, useCallback, useEffect, useState } from 'react'
import { clsx } from 'clsx'
import { useContainerQueries, QueryBreakpoints } from 'use-container-queries'
import { L } from 'vitest/dist/chunks/reporters.d.BFLkQcL6.js'
import { useGameStore } from '../../game/state'
import { GameLocations } from '../../gameLocations/GameLocations'
import {
    selectGameItem,
    selectItemQta,
    selectStorageLocationsMemo,
    isSelected,
    useLocationItems,
} from '../StorageSelectors'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { IconsData } from '../../icons/Icons'
import { setSelectedItem } from '../storageFunctions'
import { SelectedItem } from '../../items/ui/SelectedItem'
import { useTranslations } from '../../msg/useTranslations'
import { Button } from '../../components/ui/button'
import { cn } from '../../lib/utils'
import { clickStorageHeader, setStorageOrder } from '../../ui/state/uiFunctions'
import { MyPage } from '../../ui/pages/MyPage'
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon, InfoIcon } from '../../icons/IconsMemo'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import {
    selectIsStorageOrderName,
    selectIsStorageOrderQuantity,
    selectIsStorageOrderValue,
    selectStorageAsc,
} from '../../ui/state/uiSelectors'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion'
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerTrigger } from '../../components/ui/drawer'
import classes from './storage.module.css'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const breakpoints: QueryBreakpoints = {
    small: [0, 400],
    med: [401],
}
const breakpointsD: QueryBreakpoints = {
    small: [0, 500],
    med: [501],
}

const UiStorageContext = createContext<((open: boolean) => void) | null>(null)

export function UiStorage() {
    const locations = useGameStore(selectStorageLocationsMemo)
    const [open, setOpen] = useState(true)

    const { ref, active } = useContainerQueries({ breakpoints })
    const { ref: refD, active: activeD } = useContainerQueries({ breakpoints: breakpointsD })

    const [show, setShow] = useState(false)
    useEffect(() => {
        const id = setTimeout(() => setShow(true), 0)
        return () => {
            if (id) clearTimeout(id)
        }
    }, [])
    const small = active === 'small'
    const drawer = activeD === 'small'

    if (locations.length === 0) return <NoItems />
    return (
        <MyPage>
            <div className={clsx(classes.cardList)} ref={refD}>
                <Accordion type="single" collapsible className="mb-4 w-full" defaultValue={locations[0]}>
                    {locations.map((l) => (
                        <AccordionItem key={l} value={l} className="w-full">
                            <Card ref={ref}>
                                <CardHeader>
                                    <AccordionTrigger className="p-0">
                                        <CardTitle>
                                            {ChevronsUpDownIcon} {l}
                                        </CardTitle>
                                    </AccordionTrigger>
                                </CardHeader>

                                <AccordionContent>
                                    <CardContent>
                                        {small && <SortDropdown />}
                                        <UiStorageContext value={setOpen}>
                                            <LocationStorage
                                                small={small}
                                                show={show}
                                                location={GameLocations.StartVillage}
                                            />
                                        </UiStorageContext>
                                    </CardContent>
                                </AccordionContent>
                            </Card>
                        </AccordionItem>
                    ))}
                </Accordion>

                <SelectedItem />

                {drawer && (
                    <Drawer open={open} onOpenChange={setOpen}>
                        <DrawerContent>
                            <SelectedItem />

                            <DrawerFooter>
                                <DrawerClose>
                                    <Button variant="outline">Close</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                )}
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

const LocationStorage = memo(function LocationStorage(props: {
    small: boolean
    show: boolean
    location: GameLocations
}) {
    const { location, small, show } = props
    const items = useLocationItems(location)

    return (
        <Table>
            {!small && <StorageHeader />}
            {show && (
                <TableBody>
                    {items.map((i) => (
                        <StorageItem small={small} key={i.id} itemId={i.id} location={location} />
                    ))}
                </TableBody>
            )}
        </Table>
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
                <StorageHeaderValue />
                <StorageHeaderQuantity />
            </TableRow>
        </TableHeader>
    )
})

const StorageHeaderName = memo(function StorageHeaderName() {
    const order = useGameStore(selectIsStorageOrderName)
    const { t } = useTranslations()
    return (
        <TableHead>
            <Button variant="ghost" size="sm" className="w-full justify-start gap-1" onClick={nameClick}>
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
            <Button variant="ghost" size="sm" className="w-full justify-start gap-1" onClick={quantityClick}>
                {t.Quantity} {order && <StorageHeaderArrow />}
            </Button>
        </TableHead>
    )
})
const StorageHeaderValue = memo(function StorageHeaderValue() {
    const order = useGameStore(selectIsStorageOrderValue)
    const { t } = useTranslations()
    return (
        <TableHead className="w-28 text-right">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-1" onClick={valueClick}>
                {t.Value}
                {order && <StorageHeaderArrow />}
            </Button>
        </TableHead>
    )
})
const StorageHeaderArrow = memo(function StorageHeaderValue() {
    const asc = useGameStore(selectStorageAsc)
    return asc ? ArrowDownIcon : ArrowUpIcon
})

const StorageItem = memo(function StorageItem(props: { small: boolean; location: GameLocations; itemId: string }) {
    const { location, itemId, small } = props
    const { f } = useNumberFormatter()
    const { t } = useTranslations()
    const qta = useGameStore(selectItemQta(location, itemId))
    const item = useGameStore(selectGameItem(itemId))
    const selected = useGameStore(isSelected(itemId))

    const setOpen = use(UiStorageContext)
    const onClick = useCallback(() => {
        setSelectedItem(itemId, location)
        if (setOpen) setOpen(true)
    }, [itemId, location])

    if (!item) return
    if (small)
        return (
            <TableRow onClick={onClick} className={cn(classes.row, { 'bg-muted': selected })}>
                <TableCell>
                    <span className={classes.smallRow}>
                        <span className="pr-2 text-right align-middle">{IconsData[item.icon]}</span>
                        <span>{t[item.nameId]}</span>
                    </span>
                    <span className={classes.smallRow}>
                        <span className={classes.smallRowHeader}>{t.Quantity}</span>
                        {f(qta)}
                    </span>
                    <span className={classes.smallRow}>
                        <span className={classes.smallRowHeader}>{t.Value}</span>
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
                <TableCell className="text-right">{f(item.value)}</TableCell>
                <TableCell className="text-right">{f(qta)}</TableCell>
            </TableRow>
        )
})
