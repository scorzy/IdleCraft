import { ActivityState } from '../activities/ActivityState'
import { Crafting } from '../crafting/CraftingIterfaces'
import { RecipeParameter, RecipeParameterValue, RecipeResult } from '../crafting/RecipeInterfaces'
import { GameLocations } from '../gameLocations/GameLocations'
import { Item } from '../items/Item'
import { OreType } from '../mining/OreState'
import { Loot, StorageState } from '../storage/storageState'
import { InitialTimerState } from '../timers/Timer'
import { ForestsType } from '../wood/ForestsState'
import { Woodcutting } from '../wood/Woodcutting'
import { TreeGrowth } from '../wood/forest/forestGrowth'
import { Mining } from '../mining/Mining'
import { CharacterState } from '../characters/characterState'
import { ToastState } from '../notification/toastState'
import { BattleState } from '../battle/BattleTypes'
import { CastCharAbility } from '../activeAbilities/abilityInterfaces'
import { BattleLog } from '../battleLog/battleLogInterfaces'
import { UiState } from '../ui/UiState'
import { InitialState } from '@/entityAdapter/InitialState'

export interface LocationState {
    storage: StorageState
    forests: ForestsType
    ores: OreType
    loot: InitialState<Loot>
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
