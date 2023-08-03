import { GameState, LocationState } from '../game/GameState'
import { GameLocations } from '../gameLocations/GameLocations'
import { memoize } from '../utils/memoize'
import { memoizeOne } from '../utils/memoizeOne'

const selectStorageLocationsInt = memoizeOne((locations: { [k in GameLocations]: LocationState }) => {
    const res: GameLocations[] = []
    const locationsEntries = Object.entries(locations)
    for (const loc of locationsEntries) {
        if (Object.keys(loc[1].storage.StdItems).length > 0 || Object.keys(loc[1].storage.CraftedItems).length > 0)
            res.push(loc[0] as GameLocations)
    }
    return res
})

export const selectStorageLocations = (state: GameState) => selectStorageLocationsInt(state.locations)

export const selectLocationItems = memoize((location: GameLocations) => {
    const orderItems = memoizeOne((std: { [k: string]: number }, craft: { [k: string]: number }) => {
        return Object.entries(std)
            .map((e) => {
                return {
                    type: 'std',
                    id: e[0],
                }
            })
            .concat(
                Object.entries(craft).map((e) => {
                    return {
                        type: 'craft',
                        id: e[0],
                    }
                })
            )
    })

    return (state: GameState) => {
        const loc = state.locations[location]
        const stdItems = loc.storage.StdItems
        const craftedItems = loc.storage.CraftedItems

        return orderItems(stdItems, craftedItems)
    }
})
