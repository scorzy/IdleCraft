import { useGameStore } from '../../game/state'
import { GameLocations } from '../../gameLocations/GameLocations'
import { selectItem, selectItemQta, selectLocationItems, selectStorageLocations } from '../StorageSelectors'
import { Page } from '../../ui/shell/AppShell'
import { memo, useCallback, useState } from 'react'
import { MyCard } from '../../ui/myCard/myCard'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { IconsData } from '../../icons/Icons'
import classes from './storage.module.css'
import { getItemId2, setSelectedItem } from '../storageFunctions'
import { SelectedItem } from '../../items/ui/SelectedItem'
import { useTranslations } from '../../msg/useTranslations'
import { Button, buttonVariants } from '../../components/ui/button'
import { cn } from '../../lib/utils'
import { LuChevronsUpDown } from 'react-icons/lu'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

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
        <div>
            <Collapsible onClick={handleClick} open={open}>
                <CollapsibleTrigger>
                    <Button variant="ghost" size="sm">
                        {location}
                        <LuChevronsUpDown className="h-4 w-4 ml-2" />
                        <span className="sr-only">{location}</span>
                    </Button>
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
        </div>
    )
})

const StorageItem = memo(function StorageItem(props: {
    isLast: boolean
    location: GameLocations
    stdItemId: string | null
    craftItemId: string | null
}) {
    const { location, stdItemId, craftItemId } = props
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
            <button
                onClick={onClick}
                className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'w-full justify-start gap-4 font-normal',
                    classes.item
                )}
            >
                {IconsData[item.icon]}
                <span className="justify-self-start">{t[item.nameId]}</span>
                <span className="monospace">{f(qta)}</span>
            </button>
        </>
    )
})
