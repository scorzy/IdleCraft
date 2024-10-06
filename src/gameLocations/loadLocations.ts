import { GameState } from '../game/GameState'
import { loadOre } from '../mining/miningFunctions'
import { loadForest } from '../wood/forest/forestFunctions'
import { GameLocations } from './GameLocations'

export function loadLocation(state: GameState, data: object) {
    if (!('locations' in data && data.locations && typeof data.locations === 'object')) return

    const dataLoc = data.locations as Record<string, unknown>
    Object.keys(GameLocations).forEach((loc) => {
        if (!(loc in dataLoc)) return
        const locationData = dataLoc[loc] as Record<string, unknown>
        const location = state.locations[loc as GameLocations]

        if ('storage' in locationData) {
            const storage = locationData.storage as Record<string, unknown>

            const stdEntries = Object.entries(storage)
            for (const entryStd of stdEntries)
                if (typeof entryStd[1] === 'number') location.storage[entryStd[0]] = entryStd[1]
        }

        if ('forests' in locationData) location.forests = loadForest(locationData.forests)
        if ('ores' in locationData) location.ores = loadOre(locationData.forests)
    })
}
