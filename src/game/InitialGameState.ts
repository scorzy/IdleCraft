import { ActivityAdapter } from '../activities/ActivityState'
import { CraftingAdapter } from '../crafting/CraftingAdapter'
import { CommaTypes } from '../formatters/CommaTypes'
import { NotationTypes } from '../formatters/NotationTypes'
import { GameLocations } from '../gameLocations/GameLocations'
import { MiningAdapter } from '../mining/MiningAdapter'
import { OreTypes } from '../mining/OreTypes'
import { ItemAdapter } from '../storage/ItemAdapter'
import { TimerAdapter } from '../timers/Timer'
import { UiPages } from '../ui/state/UiPages'
import { WoodTypes } from '../wood/WoodTypes'
import { WoodcuttingAdapter } from '../wood/WoodcuttingAdapter'
import { TreeGrowthAdapter } from '../wood/forest/forestGrowth'
import { GameState, LocationState } from './GameState'
import { ExpAdapter } from '../experience/ExpAdapter'

const InitialVillageState: LocationState = {
    storage: {
        StdItems: {},
        CraftedItems: {},
    },
    forests: {},
    ores: {},
}

export const InitialGameState: GameState = {
    ui: {
        open: false,
        theme: 'system',
        page: UiPages.Storage,
        comma: CommaTypes.AUTO,
        lang: 'eng',
        numberFormatNotation: NotationTypes.STANDARD,
        woodType: WoodTypes.DeadTree,
        collapsed: {},
        selectedStdItemId: null,
        selectedCraftedItemId: null,
        selectedItemLocation: null,
        storageOrder: 'name',
        storageAsc: true,
        oreType: OreTypes.Copper,
    },
    exp: ExpAdapter.getInitialState(),
    location: GameLocations.StartVillage,
    activities: ActivityAdapter.getInitialState(),
    orderedActivities: [],
    activityId: null,
    activityDone: 0,
    lastActivityDone: 0,
    timers: TimerAdapter.getInitialState(),
    now: Date.now(),
    loading: false,
    craftedItems: ItemAdapter.getInitialState(),
    woodcutting: WoodcuttingAdapter.getInitialState(),
    waitingTrees: null,
    locations: {
        [GameLocations.StartVillage]: InitialVillageState,
    },
    treeGrowth: TreeGrowthAdapter.getInitialState(),
    crafting: CraftingAdapter.getInitialState(),
    recipeId: '',
    mining: MiningAdapter.getInitialState(),
    craftingForm: {
        params: [],
        paramsValue: [],
        result: undefined,
    },
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
export const GetInitialGameState: () => GameState = () => JSON.parse(JSON.stringify(InitialGameState))
