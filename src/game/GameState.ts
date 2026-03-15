import { Effects } from '@/effects/types/Effects'
import { InitialState } from '@/entityAdapter/InitialState'
import { CastCharAbility } from '../activeAbilities/abilityInterfaces'
import { ActivityState } from '../activities/ActivityState'
import { BattleLog } from '../battleLog/battleLogInterfaces'
import { CharacterState } from '../characters/characterState'
import { RecipeParameter, RecipeParameterValue, RecipeResult } from '../crafting/RecipeInterfaces'
import { AppliedEffect } from '../effects/types/AppliedEffect'
import { GameLocations } from '../gameLocations/GameLocations'
import { Item } from '../items/Item'
import { OreType, OreVeinState } from '../mining/OreState'
import { OreTypes } from '../mining/OreTypes'
import { ToastState } from '../notification/toastState'
import { QuestState } from '../quests/QuestTypes'
import { LootId, StorageState } from '../storage/storageTypes'
import { InitialTimerState } from '../timers/Timer'
import { UiState } from '../ui/UiState'
import { ForestsType } from '../wood/ForestsState'
import { TreeGrowth } from '../wood/forest/forestGrowth'
import { GrowSpeedBonus } from '../wood/forest/growSpeedBonus'

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
    growSpeedBonuses: InitialState<GrowSpeedBonus>
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
