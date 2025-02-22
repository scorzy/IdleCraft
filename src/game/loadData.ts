import { ActivityAdapter } from '../activities/ActivityState'
import { CraftingAdapter } from '../crafting/CraftingAdapter'
import { ItemAdapter } from '../storage/ItemAdapter'
import { TimerAdapter } from '../timers/Timer'
import { copyValues } from '../utils/copyValues'
import { TreeGrowthAdapter } from '../wood/forest/forestGrowth'
import { BattleAdapter } from '../battle/BattleAdapter'
import { CastCharAbilityAdapter } from '../activeAbilities/abilityAdapters'
import { CharacterAdapter } from '../characters/characterAdapter'
import { RecipeParameter, RecipeParameterValue, RecipeResult } from '../crafting/RecipeInterfaces'
import { loadUi } from '../ui/loadUi'
import { loadLocation } from '../gameLocations/loadLocations'
import { GameState } from './GameState'
import { GetInitialGameState } from './InitialGameState'

export function loadData(data: object): GameState {
    const state = GetInitialGameState()
    copyValues(state, data)
    loadUi(data, state)

    if ('activities' in data) state.activities = ActivityAdapter.load(data.activities)
    if ('timers' in data) state.timers = TimerAdapter.load(data.timers)
    if ('craftedItems' in data) state.craftedItems = ItemAdapter.load(data.craftedItems)
    if ('treeGrowth' in data) state.treeGrowth = TreeGrowthAdapter.load(data.treeGrowth)
    if ('crafting' in data) state.crafting = CraftingAdapter.load(data.crafting)
    if ('battle' in data) state.battle = BattleAdapter.load(data.battle)
    if ('castCharAbility' in data) state.castCharAbility = CastCharAbilityAdapter.load(data.castCharAbility)

    if (
        'orderedActivities' in data &&
        data.orderedActivities &&
        Array.isArray(data.orderedActivities) &&
        data.orderedActivities.every((e) => typeof e === 'string')
    )
        state.orderedActivities = data.orderedActivities

    loadLocation(state, data)

    if ('characters' in data) state.characters = CharacterAdapter.load(data.characters)

    if ('craftingForm' in data)
        state.craftingForm = data.craftingForm as {
            params: RecipeParameter[]
            paramsValue: RecipeParameterValue[]
            result: RecipeResult | undefined
        }

    return state
}
