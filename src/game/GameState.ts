import { ActivityState } from '../activities/ActivityState'
import { RecipeParameter, RecipeParameterValue, RecipeResult } from '../crafting/RecipeInterfaces'
import { GameLocations } from '../gameLocations/GameLocations'
import { Item } from '../items/Item'
import { OreType } from '../mining/OreState'
import { LootId, StorageState } from '../storage/storageState'
import { InitialTimerState } from '../timers/Timer'
import { ForestsType } from '../wood/ForestsState'
import { TreeGrowth } from '../wood/forest/forestGrowth'
import { CharacterState } from '../characters/characterState'
import { ToastState } from '../notification/toastState'
import { CastCharAbility } from '../activeAbilities/abilityInterfaces'
import { BattleLog } from '../battleLog/battleLogInterfaces'
import { UiState } from '../ui/UiState'
import { InitialState } from '@/entityAdapter/InitialState'

export interface LocationState {
    storage: StorageState
    forests: ForestsType
    ores: OreType
    loot: LootId[]
}
export interface GameState {
    gameId: string
    loadingData?: {
        loading: boolean
        start: number
        now: number
        end: number
        percent: number
    }
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
    waitingTrees: string | null
    locations: { [k in GameLocations]: LocationState }
    treeGrowth: InitialState<TreeGrowth>
    recipeId: string
    craftingForm: {
        params: RecipeParameter[]
        paramsValue: RecipeParameterValue[]
        result: RecipeResult | undefined
    }
    characters: InitialState<CharacterState>
    castCharAbility: InitialState<CastCharAbility>
    battleLogs: InitialState<BattleLog>
}
