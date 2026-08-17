import { ActivityAdapter, ActivityTypes } from '../../activities/ActivityState'
import { ActivityStartResult } from '../../activities/activityInterfaces'
import { makeStartActivity } from '../../activities/functions/makeStartActivity'
import { Bonus, BonusResult } from '../../bonus/Bonus'
import { getTotal } from '../../bonus/BonusFunctions'
import { GameState } from '../../game/GameState'
import { LocationModifierType } from '../../gameLocations/modifiers/LocationModifier'
import { selectLocationModifierBonusResult } from '../../gameLocations/modifiers/locationModifierSelectors'
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

    const locationModifierBonuses = selectLocationModifierBonusResult(
        s,
        s.location,
        LocationModifierType.OreVeinSearchTime
    )

    for (const bonus of locationModifierBonuses.bonuses) ret.bonuses.push(bonus)

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
