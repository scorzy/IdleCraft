import { ActivityAdapter } from '../activities/ActivityState'
import { CommaTypes } from '../formatters/CommaTypes'
import { NotationTypes } from '../formatters/NotationTypes'
import { GameLocations } from '../gameLocations/GameLocations'
import { TimerAdapter } from '../timers/Timer'
import { UiPages } from '../ui/state/UiPages'
import { WoodTypes } from '../wood/WoodTypes'
import { WoodcuttingAdapter } from '../wood/WoodcuttingAdapter'
import { TreeGrowthAdapter } from '../wood/forest/forestGrowth'
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
        lang: 'eng',
        numberFormatNotation: NotationTypes.STANDARD,
        woodType: WoodTypes.DeadTree,
        collapsed: {},
        selectedStdItemId: null,
        selectedCraftedItemId: null,
        selectedItemLocation: null,
    },
    location: GameLocations.StartVillage,
    activities: ActivityAdapter.getInitialState(),
    orderedActivities: [],
    activityId: null,
    activityDone: 0,
    lastActivityDone: 0,
    timers: TimerAdapter.getInitialState(),
    now: Date.now(),
    loading: false,
    craftedItems: {},
    woodcutting: WoodcuttingAdapter.getInitialState(),
    locations: {
        [GameLocations.StartVillage]: InitialVillageState,
    },
    treeGrowth: TreeGrowthAdapter.getInitialState(),
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
export const GetInitialGameState: () => GameState = () => JSON.parse(JSON.stringify(InitialGameState))
