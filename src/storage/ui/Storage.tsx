import { useState } from 'react'
import { useGameStore } from '../../game/state'
import { GameLocations } from '../../gameLocations/GameLocations'
import { selectLocationItems, selectStorageLocations } from '../StorageSelectors'
import { Button } from '../../ui/button/Button'

export function UiStorage() {
    const locations = useGameStore(selectStorageLocations)
    console.log(locations)
    return (
        <>
            {locations.map((l) => (
                <LocationStorage key={l} location={GameLocations.StartVillage} />
            ))}
        </>
    )
}
function LocationStorage(props: { location: GameLocations }) {
    const { location } = props
    const [open, setOpen] = useState(true)
    const items = useGameStore(selectLocationItems(location))

    return (
        <div>
            <Button onClick={() => setOpen(!open)}>{location}</Button>

            {open && items.map((i) => <StorageItem key={i.id + i.type} id={i.id} type={i.type} />)}
        </div>
    )
}
function StorageItem(props: { type: string; id: string }) {
    const { type, id } = props
    return (
        <div>
            {id} {type}
        </div>
    )
}
