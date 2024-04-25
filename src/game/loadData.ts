import { ActivityAdapter } from '../activities/ActivityState'
import { CraftingAdapter } from '../crafting/CraftingAdapter'
import { GameLocations } from '../gameLocations/GameLocations'
import { StdItemsEntries } from '../items/stdItems'
import { MiningAdapter } from '../mining/MiningAdapter'
import { loadOre } from '../mining/miningFunctions'
import { ItemAdapter } from '../storage/ItemAdapter'
import { TimerAdapter } from '../timers/Timer'
import { copyValues } from '../utils/copyValues'
import { WoodcuttingAdapter } from '../wood/WoodcuttingAdapter'
import { loadForest } from '../wood/forest/forestFunctions'
import { TreeGrowthAdapter } from '../wood/forest/forestGrowth'
import { BattleAdapter } from '../battle/BattleAdapter'
import { CastCharAbilityAdapter } from '../activeAbilities/abilityAdapters'
import { CharacterAdapter } from '../characters/characterAdapter'
import { RecipeParameter, RecipeParameterValue, RecipeResult } from '../crafting/RecipeInterfaces'
import { loadUi } from '../ui/loadUi'
import { GameState } from './GameState'
import { GetInitialGameState } from './InitialGameState'

export function loadData(data: object): GameState {
    const state = GetInitialGameState()
    copyValues(state, data)
    loadUi(data, state)

    if ('activities' in data) state.activities = ActivityAdapter.load(data.activities)
    if ('timers' in data) state.timers = TimerAdapter.load(data.timers)
    if ('craftedItems' in data) state.craftedItems = ItemAdapter.load(data.craftedItems)
    if ('woodcutting' in data) state.woodcutting = WoodcuttingAdapter.load(data.woodcutting)
    if ('treeGrowth' in data) state.treeGrowth = TreeGrowthAdapter.load(data.treeGrowth)
    if ('crafting' in data) state.crafting = CraftingAdapter.load(data.crafting)
    if ('mining' in data) state.mining = MiningAdapter.load(data.mining)
    if ('battle' in data) state.battle = BattleAdapter.load(data.battle)
    if ('castCharAbility' in data) state.castCharAbility = CastCharAbilityAdapter.load(data.castCharAbility)

    if (
        'orderedActivities' in data &&
        data.orderedActivities &&
        Array.isArray(data.orderedActivities) &&
        data.orderedActivities.every((e) => typeof e === 'string')
    )
        state.orderedActivities = data.orderedActivities as string[]

    if ('locations' in data && data.locations && typeof data.locations === 'object') {
        const dataLoc = data.locations as Record<string, unknown>
        Object.keys(GameLocations).forEach((loc) => {
            if (!(loc in dataLoc)) return
            const locationData = dataLoc[loc] as Record<string, unknown>
            const location = state.locations[loc as GameLocations]

            if ('storage' in locationData) {
                const storage = locationData.storage as Record<string, unknown>
                if ('StdItems' in storage)
                    for (const entryStd of Object.entries(storage.StdItems as Record<string, unknown>))
                        if (typeof entryStd[1] === 'number' && StdItemsEntries.find((i) => i.id === entryStd[0]))
                            location.storage.StdItems[entryStd[0]] = entryStd[1]

                if ('CraftedItems' in storage)
                    for (const entryCraft of Object.entries(storage.CraftedItems as Record<string, unknown>))
                        if (typeof entryCraft[0] === 'string' && typeof entryCraft[1] === 'number')
                            location.storage.CraftedItems[entryCraft[0]] = entryCraft[1]
            }

            if ('forests' in locationData) location.forests = loadForest(locationData.forests)
            if ('ores' in locationData) location.ores = loadOre(locationData.forests)
        })
    }

    if ('characters' in data) state.characters = CharacterAdapter.load(data.characters)

    if ('craftingForm' in data)
        state.craftingForm = data.craftingForm as {
            params: RecipeParameter[]
            paramsValue: RecipeParameterValue[]
            result: RecipeResult | undefined
        }

    return state
}
