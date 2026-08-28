import { Effects } from '@/effects/types/Effects'
import { InitialState } from '@/entityAdapter/InitialState'
import { CastCharAbility } from '../activeAbilities/abilityInterfaces'
import { ActivityState } from '../activities/ActivityState'
import { BattleLog } from '../battleLog/battleLogInterfaces'
import { CaravanTierId, RouteConfig } from '../caravans/CaravanConst'
import { Shipment } from '../caravans/ShipmentState'
import { CharacterState } from '../characters/characterState'
import { RecipeGroups, RecipeParameter, RecipeParameterValue } from '../crafting/RecipeInterfaces'
import { AppliedEffect } from '../effects/types/AppliedEffect'
import { GameLocations } from '../gameLocations/GameLocations'
import { LocationModifier } from '../gameLocations/modifiers/LocationModifier'
import { GatheringZone } from '../gathering/gatheringZones'
import { Item } from '../items/Item'
import { OreType, OreVeinState } from '../mining/OreState'
import { OreTypes } from '../mining/OreTypes'
import { ToastState } from '../notification/toastState'
import { QuestState } from '../quests/QuestTypes'
import { LootId, StorageState } from '../storage/storageTypes'
import { InitialTimerState } from '../timers/Timer'
import { UiState } from '../ui/state/UiState'
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
    id: GameLocations
    caravanSlots: number
    caravanRoutes: RouteConfig[]
    storage: InitialState<StorageState>
    forests: ForestsType
    ores: OreType
    oreVeins: Partial<Record<OreTypes, OreVeinState[]>>
    loot: LootId[]
    unlockedGatheringZones: GatheringZone[]
    modifiers: InitialState<LocationModifier>
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
    locations: InitialState<LocationState>
    treeGrowth: InitialState<TreeGrowth>
    growSpeedBonuses: InitialState<GrowSpeedBonus>
    recipeId: string
    craftingForm: {
        recipeGroup: RecipeGroups | undefined
        params: RecipeParameter[]
        paramsValue: RecipeParameterValue[]
        autoBuy: Record<string, boolean>
    }
    characters: InitialState<CharacterState>
    castCharAbility: InitialState<CastCharAbility>
    battleLogs: InitialState<BattleLog>
    quests: InitialState<QuestState>
    completedQuestTemplates: string[]
    discoveredEffects: Record<string, Effects[]>
    effects: InitialState<AppliedEffect>
    addActType: AddActivityTypes
    removeOtherActivities: boolean
    startActNow: boolean
    actRepetitions: number
    actAutoRemove: boolean
    shipments: InitialState<Shipment>
    caravanDispatchForm: {
        toId: GameLocations | undefined
        tierId: CaravanTierId | undefined
        cargo: StorageState[]
    }
}
