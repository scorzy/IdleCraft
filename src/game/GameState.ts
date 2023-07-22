import { ActivityState } from '../activities/ActivityState'
import { InitialState } from '../entityAdapter/entityAdapter'
import { CommaTypes } from '../formatters/CommaTypes'
import { NotationTypes } from '../formatters/NotationTypes'
import { GameLocations } from '../gameLocations/GameLocations'
import { StorageState } from '../storage/storageState'
import { Timer } from '../timers/Timer'
import { UiPages } from '../ui/state/UiPages'
import { ForestsType, Woodcutting } from '../wood/WoodInterfaces'
export interface LocationState {
    storage: StorageState
    forests: ForestsType
}
export interface GameState {
    ui: {
        open: boolean
        dark: boolean
        page: UiPages
        comma: CommaTypes
        numberFormatNotation: NotationTypes
        lang: string
    }
    timers: InitialState<Timer>
    loading: boolean
    now: number
    location: GameLocations
    activities: InitialState<ActivityState>
    woodcutting: InitialState<Woodcutting>
    locations: {
        [k in GameLocations]: LocationState
    }
}
