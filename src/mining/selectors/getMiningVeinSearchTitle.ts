import { ActivityAdapter } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { selectTranslations } from '../../msg/useTranslations'
import { OreTypes } from '../OreTypes'

export function getMiningVeinSearchTitle(state: GameState, id: string) {
    const tr = selectTranslations(state)
    const act = ActivityAdapter.select(state.activities, id)
    if (!act || !('oreType' in act) || (act.oreType !== OreTypes.Copper && act.oreType !== OreTypes.Tin))
        return tr.t.SearchOreVein

    return `${tr.t.SearchOreVein} ${tr.t[act.oreType === OreTypes.Copper ? 'CopperMat' : 'TinMat']}`
}
