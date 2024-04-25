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
import { PLAYER_CHAR, PLAYER_ID } from '../characters/charactersConst'
import { BattleAdapter } from '../battle/BattleAdapter'
import { CastCharAbilityAdapter } from '../activeAbilities/abilityAdapters'
import { BattleLogAdapter } from '../battleLog/battleLogAdapter'
import { RecipeTypes } from '../crafting/RecipeInterfaces'
import { GameState, LocationState } from './GameState'

const InitialVillageState: () => LocationState = () =>
    structuredClone({
        storage: {
            StdItems: {},
            CraftedItems: {},
        },
        forests: {},
        ores: {},
    })

export const InitialGameState: GameState = {
    gameId: '',
    isTimer: false,
    lastRegen: 0,
    ui: {
        open: false,
        theme: 'system',
        themeColor: '',
        page: UiPages.Storage,
        comma: CommaTypes.AUTO,
        lang: 'eng',
        numberFormatNotation: NotationTypes.STANDARD,
        woodType: WoodTypes.DeadTree,
        selectedStdItemId: null,
        selectedCraftedItemId: null,
        selectedItemLocation: null,
        storageOrder: 'name',
        storageAsc: true,
        oreType: OreTypes.Copper,
        showAvailablePerks: true,
        showOwnedPerks: true,
        showUnavailablePerks: true,
        battleZone: null,
        selectedCharId: PLAYER_ID,
        collapsed: {},
        defaultClosed: {},
        deadDialog: false,
        recipeType: RecipeTypes.Smithing,
    },
    notifications: [],
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
    locations: { [GameLocations.StartVillage]: InitialVillageState(), [GameLocations.Test]: InitialVillageState() },
    treeGrowth: TreeGrowthAdapter.getInitialState(),
    crafting: CraftingAdapter.getInitialState(),
    recipeId: '',
    mining: MiningAdapter.getInitialState(),
    craftingForm: {
        params: [],
        paramsValue: [],
        result: undefined,
    },
    characters: {
        ids: [PLAYER_ID],
        entries: {
            [PLAYER_ID]: PLAYER_CHAR,
        },
    },
    battle: BattleAdapter.getInitialState(),
    castCharAbility: CastCharAbilityAdapter.getInitialState(),
    battleLogs: BattleLogAdapter.getInitialState(),
}

export const GetInitialGameState: () => GameState = () => structuredClone(InitialGameState)
