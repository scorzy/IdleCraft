import { ActivityState } from '../activities/ActivityState'
import { InitialState } from '../entityAdapter/entityAdapter'
import { GameLocations } from '../gameLocations/GameLocations'
import { StorageState } from '../storage/storageState'
import { ForestsType } from '../wood/ForestSate'
export interface LocationState {
    storage: StorageState
    forests: ForestsType
}
export interface GameState {
    open: boolean
    dark: boolean
    location: GameLocations
    activities: InitialState<ActivityState>
    locations: {
        [k in GameLocations]: LocationState
    }
}
