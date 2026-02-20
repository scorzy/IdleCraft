import { ActivityState } from '../activities/ActivityState'
import { RecipeParameter, RecipeParameterValue, RecipeResult } from '../crafting/RecipeInterfaces'
import { GameLocations } from '../gameLocations/GameLocations'
import { Item } from '../items/Item'
import { OreType, OreVeinState } from '../mining/OreState'
import { OreTypes } from '../mining/OreTypes'
import { LootId, StorageState } from '../storage/storageTypes'
import { InitialTimerState } from '../timers/Timer'
import { ForestsType } from '../wood/ForestsState'
import { TreeGrowth } from '../wood/forest/forestGrowth'
import { CharacterState } from '../characters/characterState'
import { ToastState } from '../notification/toastState'
import { CastCharAbility } from '../activeAbilities/abilityInterfaces'
import { BattleLog } from '../battleLog/battleLogInterfaces'
import { UiState } from '../ui/UiState'
import { QuestState } from '../quests/QuestTypes'
import { AppliedEffect } from '../effects/types/AppliedEffect'
import { Effects } from '@/effects/types/Effects'
import { InitialState } from '@/entityAdapter/InitialState'

export enum AddActivityTypes {
    Last = 'Last',
    First = 'First',
    Before = 'Before',
    Next = 'Next',
}
export interface LocationState {
    storage: InitialState<StorageState>
    forests: ForestsType
    ores: OreType
    oreVeins: Partial<Record<OreTypes, OreVeinState[]>>
    loot: LootId[]
}
export interface GameState {
    gameId: string
    isTimer: boolean
    gold: number
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
    locations: Record<GameLocations, LocationState>
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
    quests: InitialState<QuestState>
    discoveredEffects: Record<string, Effects[]>
    effects: InitialState<AppliedEffect>
    addActType: AddActivityTypes
    removeOtherActivities: boolean
    startActNow: boolean
    actRepetitions: number
    actAutoRemove: boolean
}
