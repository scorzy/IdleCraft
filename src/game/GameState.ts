import { ActivityState } from '../activities/ActivityState'
import { InitialState } from '../entityAdapter/entityAdapter'
import { CommaTypes } from '../formatters/CommaTypes'
import { NotationTypes } from '../formatters/NotationTypes'
import { GameLocations } from '../gameLocations/GameLocations'
import { StorageState } from '../storage/storageState'
import { Timer } from '../timers/Timer'
import { UiPages } from '../ui/state/UiPages'
import { ForestsType } from '../wood/ForestsState'
import { Woodcutting } from '../wood/WoodInterfaces'
import { WoodTypes } from '../wood/WoodTypes'
import { TreeGrowth } from '../wood/forest/forestGrowth'

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
        woodType: WoodTypes
    }
    timers: InitialState<Timer>
    loading: boolean
    now: number
    location: GameLocations
    activities: InitialState<ActivityState>
    orderedActivities: string[]
    activityId: string | null
    activityDone: number
    lastActivityDone: number
    woodcutting: InitialState<Woodcutting>
    locations: { [k in GameLocations]: LocationState }
    treeGrowth: InitialState<TreeGrowth>
}
