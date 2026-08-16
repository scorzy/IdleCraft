import { ActivityAdapter, ActivityTypes } from '../../activities/ActivityState'
import { ActivityStartResult } from '../../activities/activityInterfaces'
import { makeStartActivity } from '../../activities/functions/makeStartActivity'
import { Bonus, BonusResult } from '../../bonus/Bonus'
import { getTotal } from '../../bonus/BonusFunctions'
import { GameState } from '../../game/GameState'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { LocationModifierType } from '../../gameLocations/modifiers/LocationModifier'
import { LocationModifierDataMap } from '../../gameLocations/modifiers/LocationModifierData'
import { selectLocationModifierMulti } from '../../gameLocations/modifiers/locationModifierSelectors'
import { Icons } from '../../icons/Icons'
import { startTimer } from '../../timers/startTimer'
import { canSearchOreVein } from '../miningFunctions'
import { OreTypes } from '../OreTypes'

export const SEARCH_ORE_VEIN_TIME = 8000
const TIME_BASE: Bonus = {
    id: 'base',
    nameId: 'Base',
    iconId: Icons.Ore,
    add: SEARCH_ORE_VEIN_TIME,
}

export const selectOreVeinSearchTimeAll = (s: GameState): BonusResult => {
    const ret: BonusResult = { total: SEARCH_ORE_VEIN_TIME, bonuses: [TIME_BASE] }
    const locationModifier = selectLocationModifierMulti(s, s.location, LocationModifierType.OreVeinSearchTime)

    if (locationModifier) {
        const data = LocationModifierDataMap[LocationModifierType.OreVeinSearchTime]
        const location = GameLocationAdapter.selectEx(s.locations, s.location)
        ret.bonuses.push({
            id: `${location.id}-OreVeinSearchTime`,
            nameId: data.nameId,
            iconId: data.iconId,
            multi: locationModifier,
        })
    }

    ret.total = getTotal(ret.bonuses)
    return ret
}

export const selectOreVeinSearchTime = (state: GameState) => selectOreVeinSearchTimeAll(state).total

export const startMiningVeinSearch = makeStartActivity((state: GameState, id: string) => {
    const act = ActivityAdapter.select(state.activities, id)
    if (!act || !('oreType' in act) || (act.oreType !== OreTypes.Copper && act.oreType !== OreTypes.Tin))
        return ActivityStartResult.NotPossible

    if (!canSearchOreVein(state, state.location, act.oreType)) return ActivityStartResult.NotPossible

    startTimer(state, selectOreVeinSearchTime(state), ActivityTypes.MiningVeinSearch, id)
    return ActivityStartResult.Started
})
