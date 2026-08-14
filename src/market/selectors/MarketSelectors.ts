import { memoize } from 'proxy-memoize'
import { ActivityAdapter } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { isMarket } from '../Market'

export const selectMarketId = (s: GameState, itemId: string) => {
    for (const id of s.activities.ids) {
        const act = s.activities.entries[id]
        if (act && isMarket(act) && act.itemId === itemId) return act.id
    }
}

export const selectMarketIds = memoize((s: GameState) => ActivityAdapter.findManyIds(s.activities, (a) => isMarket(a)))
