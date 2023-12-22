import { ActivityState } from '../activities/ActivityState'
import { Crafting } from '../crafting/CraftingIterfaces'
import { RecipeParameter, RecipeParameterValue, RecipeResult, RecipeTypes } from '../crafting/RecipeInterfaces'
import { InitialState } from '../entityAdapter/entityAdapter'
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
import { PerksEnum } from '../perks/perksEnum'
import { PerkState } from '../perks/PerkState'
import { ToastState } from '../notification/toastState'
import { BattleState } from '../battle/BattleTypes'

export const Globals = { loadTo: 0 }
export interface LocationState {
    storage: StorageState
    forests: ForestsType
    ores: OreType
}
export interface GameState {
    gameId: string
    ui: {
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
        sidebarCollapsed: boolean
        gatheringCollapsed: boolean
        craftingCollapsed: boolean
        perk: PerksEnum
        showAvailablePerks: boolean
        showUnavailablePerks: boolean
        showOwnedPerks: boolean
    }
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
    perks: PerkState
    craftingForm: {
        params: RecipeParameter[]
        paramsValue: RecipeParameterValue[]
        result: RecipeResult | undefined
    }
    characters: InitialState<CharacterState>
    battle: InitialState<BattleState>
}
