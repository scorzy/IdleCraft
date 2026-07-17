import { ActivityAdapter } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { isMining } from '../Mining'
import { getCurrentOreVeinByType } from '../miningFunctions'
import { selectMiningId } from '../miningSelectors'
import { OreVeinState } from '../OreState'
import { OreTypes } from '../OreTypes'

export function selectActiveVein(state: GameState, oreType: OreTypes): OreVeinState | undefined {
    const actId = selectMiningId(state, oreType)
    if (!actId) return getCurrentOreVeinByType(state, state.location, oreType)

    const activity = ActivityAdapter.select(state.activities, actId)
    if (!activity || !isMining(activity) || !activity.activeVeinId)
        return getCurrentOreVeinByType(state, state.location, oreType)

    const activeVein = (GameLocationAdapter.selectEx(state.locations, state.location).oreVeins[oreType] ?? []).find(
        (w) => w.id === activity.activeVeinId
    )
    if (activeVein) return activeVein

    return getCurrentOreVeinByType(state, state.location, oreType)
}
