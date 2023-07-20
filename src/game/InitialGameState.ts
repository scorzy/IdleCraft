import { ActivityAdapter } from '../activities/ActivityState'
import { GameLocations } from '../gameLocations/GameLocations'
import { GameState, LocationState } from './GameState'

const InitialVillageState: LocationState = {
    storage: {
        StdItems: {},
        CraftedItems: {},
    },
    forests: {},
}

export const InitialGameState: GameState = {
    open: false,
    dark: true,
    location: GameLocations.StartVillage,
    activities: ActivityAdapter.getInitialState(),
    locations: {
        [GameLocations.StartVillage]: InitialVillageState,
    },
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
export const GetInitialGameState: () => GameState = () => JSON.parse(JSON.stringify(InitialGameState))
