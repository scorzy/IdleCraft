import { ActivityAdapter } from '../activities/ActivityState'
import { CommaTypes } from '../formatters/CommaTypes'
import { NotationTypes } from '../formatters/NotationTypes'
import { GameLocations } from '../gameLocations/GameLocations'
import { TimerAdapter } from '../timers/Timer'
import { UiPages } from '../ui/state/UiPages'
import { WoodcuttingAdapter } from '../wood/WoodcuttingAdapter'
import { GameState, LocationState } from './GameState'

const InitialVillageState: LocationState = {
    storage: {
        StdItems: {},
        CraftedItems: {},
    },
    forests: {},
}

export const InitialGameState: GameState = {
    ui: {
        open: false,
        dark: true,
        page: UiPages.Storage,
        comma: CommaTypes.AUTO,
        lang: 'Eng',
        numberFormatNotation: NotationTypes.STANDARD,
    },
    location: GameLocations.StartVillage,
    activities: ActivityAdapter.getInitialState(),
    timers: TimerAdapter.getInitialState(),
    now: Date.now(),
    loading: false,
    woodcutting: WoodcuttingAdapter.getInitialState(),
    locations: {
        [GameLocations.StartVillage]: InitialVillageState,
    },
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
export const GetInitialGameState: () => GameState = () => JSON.parse(JSON.stringify(InitialGameState))
