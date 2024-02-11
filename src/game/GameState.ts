import { ActivityState } from '../activities/ActivityState'
import { Crafting } from '../crafting/CraftingIterfaces'
import { RecipeParameter, RecipeParameterValue, RecipeResult, RecipeTypes } from '../crafting/RecipeInterfaces'
import { CommaTypes } from '../formatters/CommaTypes'
import { NotationTypes } from '../formatters/NotationTypes'
import { GameLocations } from '../gameLocations/GameLocations'
import { Item } from '../items/Item'
import { OreType } from '../mining/OreState'
import { StorageState } from '../storage/storageState'
import { InitialTimerState } from '../timers/Timer'
import { UiPages } from '../ui/state/UiPages'
import { ForestsType } from '../wood/ForestsState'
import { Woodcutting } from '../wood/Woodcutting'
import { WoodTypes } from '../wood/WoodTypes'
import { TreeGrowth } from '../wood/forest/forestGrowth'
import { Mining } from '../mining/Mining'
import { OreTypes } from '../mining/OreTypes'
import { CharacterState } from '../characters/characterState'
import { ToastState } from '../notification/toastState'
import { BattleState } from '../battle/BattleTypes'
import { BattleZoneEnum } from '../battle/BattleZoneEnum'
import { CastCharAbility } from '../activeAbilities/abilityInterfaces'
import { CollapsedEnum } from '../ui/sidebar/CollapsedEnum'
import { BattleLog } from '../battleLog/battleLogInterfaces'
import { InitialState } from '@/entityAdapter/InitialState'

export interface LocationState {
    storage: StorageState
    forests: ForestsType
    ores: OreType
}
export interface UiState {
    open: boolean
    theme: string
    themeColor: string
    page: UiPages
    comma: CommaTypes
    numberFormatNotation: NotationTypes
    lang: string
    woodType: WoodTypes
    oreType: OreTypes
    selectedStdItemId: string | null
    selectedCraftedItemId: string | null
    selectedItemLocation: GameLocations | null
    recipeType?: RecipeTypes
    storageOrder: 'name' | 'quantity' | 'value'
    storageAsc: boolean
    showAvailablePerks: boolean
    showUnavailablePerks: boolean
    showOwnedPerks: boolean
    battleZone: BattleZoneEnum | null
    selectedCharId: string
    collapsed: { [K in CollapsedEnum]?: boolean }
    defaultClosed: { [k in string]: boolean }
}
export interface GameState {
    gameId: string
    isTimer: boolean
    lastRegen: number
    ui: UiState
    notifications: ToastState
    timers: InitialTimerState
    loading: boolean
    now: number
    location: GameLocations
    activities: InitialState<ActivityState>
    orderedActivities: string[]
    activityId: string | null
    activityDone: number
    lastActivityDone: number
    craftedItems: InitialState<Item>
    woodcutting: InitialState<Woodcutting>
    waitingTrees: string | null
    locations: { [k in GameLocations]: LocationState }
    treeGrowth: InitialState<TreeGrowth>
    crafting: InitialState<Crafting>
    recipeId: string
    mining: InitialState<Mining>
    craftingForm: {
        params: RecipeParameter[]
        paramsValue: RecipeParameterValue[]
        result: RecipeResult | undefined
    }
    characters: InitialState<CharacterState>
    battle: InitialState<BattleState>
    castCharAbility: InitialState<CastCharAbility>
    battleLogs: InitialState<BattleLog>
}
