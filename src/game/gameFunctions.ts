import { ActivityAdapter } from '../activities/ActivityState'
import { CraftingAdapter } from '../crafting/CraftingAdapter'
import { GameLocations } from '../gameLocations/GameLocations'
import { StdItemsEntries } from '../items/stdItems'
import { MiningAdapter } from '../mining/MiningAdapter'
import { loadOre } from '../mining/miningFunctions'
import { ItemAdapter } from '../storage/ItemAdapter'
import { InitialTimerState, Timer, TimerAdapter } from '../timers/Timer'
import { onTimer } from '../timers/onTimer'
import { execTimer } from '../timers/timerFunctions'
import { copyValues } from '../utils/copyValues'
import { WoodcuttingAdapter } from '../wood/WoodcuttingAdapter'
import { loadForest } from '../wood/forest/forestFunctions'
import { TreeGrowthAdapter } from '../wood/forest/forestGrowth'
import { GameState, Globals } from './GameState'
import { GetInitialGameState } from './InitialGameState'
import { useGameStore } from './state'
import { CharacterState } from '../characters/characterState'
import { ExpEnum, ExpEnumKeys } from '../experience/expEnum'
import { PerksEnum, PerksEnumKeys } from '../perks/perksEnum'

const MAX_LOAD = 3600 * 1000 * 24 * 1
// const TEST_DIF = 3600 * 1000 * 24 * 360
const TEST_DIF = 0

export declare function setTimeout(this: Window | void, handler: (...args: unknown[]) => void, timeout: number): number
export declare function setTimeout(this: Window | void, handler: unknown, timeout?: unknown, ...args: unknown[]): number

export const load = (data: object) => {
    let state = loadData(data)
    state = loadGame(state)
    useGameStore.setState(state)
}

function loadData(data: object): GameState {
    const state = GetInitialGameState()
    copyValues(state, data)

    if ('ui' in data && data.ui) copyValues(state.ui, data.ui)

    if ('activities' in data) state.activities = ActivityAdapter.load(data.activities)
    if ('timers' in data) state.timers = TimerAdapter.load(data.timers)
    if ('craftedItems' in data) state.craftedItems = ItemAdapter.load(data.craftedItems)
    if ('woodcutting' in data) state.woodcutting = WoodcuttingAdapter.load(data.woodcutting)
    if ('treeGrowth' in data) state.treeGrowth = TreeGrowthAdapter.load(data.treeGrowth)
    if ('crafting' in data) state.crafting = CraftingAdapter.load(data.crafting)
    if ('mining' in data) state.mining = MiningAdapter.load(data.mining)

    if ('skillsExp' in data && data.skillsExp && typeof data.skillsExp === 'object')
        Object.entries(data.skillsExp).forEach((kv) => {
            const key = kv[0]
            if (typeof key === 'string' && typeof kv[1] === 'number' && ExpEnumKeys.includes(key))
                state.skillsExp[key as ExpEnum] = kv[1]
        })

    if ('skillsLevel' in data && data.skillsLevel && typeof data.skillsLevel === 'object')
        Object.entries(data.skillsLevel).forEach((kv) => {
            const key = kv[0]
            if (typeof key === 'string' && typeof kv[1] === 'number' && ExpEnumKeys.includes(key))
                state.skillsLevel[key as ExpEnum] = kv[1]
        })

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
    if ('characters' in data) {
        // ToDo
        state.characters = data.characters as { [k in string]: CharacterState }
    }

    if ('perks' in data && data.perks && typeof data.perks === 'object')
        Object.entries(data.perks).forEach((kv) => {
            const key = kv[0]
            if (typeof key === 'string' && typeof kv[1] === 'number' && PerksEnumKeys.includes(key))
                state.perks[key as PerksEnum] = kv[1]
        })

    return state
}

function getFirstTimer(timers: InitialTimerState, max: number): Timer | null {
    const timerId = timers.minId
    if (!timerId) return null
    const timer = TimerAdapter.select(timers, timerId)
    if (!timer) return null
    if (timer.to > max) return null
    return timer
}

function loadGame(state: GameState): GameState {
    state.now = state.now - TEST_DIF
    for (const id of state.timers.ids) {
        const timer = state.timers.entries[id]
        if (timer) {
            timer.from -= TEST_DIF
            timer.to -= TEST_DIF
        }
    }

    state.loading = true
    const now = Math.min(state.now + MAX_LOAD, Date.now())
    Globals.loadTo = now

    if (state.timers.ids.length < 1) return state

    for (const id of state.timers.ids) {
        const timer = state.timers.entries[id]
        if (timer) timer.intervalId = undefined
    }

    let timer = getFirstTimer(state.timers, now)
    while (timer) {
        state.now = timer.to
        state = onTimer(state, timer.id)

        const timerEx = TimerAdapter.select(state.timers, timer.id)
        if (timerEx) state.timers = TimerAdapter.remove(state.timers, timerEx.id)

        timer = getFirstTimer(state.timers, now)
    }
    if (state.now < now) state.now = now

    for (const id of state.timers.ids) {
        const timer = state.timers.entries[id]
        if (!timer) continue
        if (timer.intervalId) continue

        const diff = Math.max(timer.to - state.now, 0)
        timer.intervalId = setTimeout(() => execTimer(id), diff)
    }

    state.loading = false
    return state
}
