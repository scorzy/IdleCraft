import { memoize } from 'proxy-memoize'
import { Bonus, BonusResult } from '../../bonus/Bonus'
import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { GatheringData } from '../gatheringData'

export const selectGatheringTimeAll = (state: GameState): BonusResult => {
    const zone = state.ui.gatheringZone
    const zoneData = GatheringData[zone]

    const baseBonus: Bonus = {
        id: `base-${zone}`,
        nameId: zoneData.nameId,
        iconId: Icons.Forest,
        add: zoneData.gatheringTime,
    }

    return {
        total: zoneData.gatheringTime,
        bonuses: [baseBonus],
    }
}

export const selectGatheringTime = (state: GameState) => selectGatheringTimeAll(state).total
export const selectGatheringTimeAllMemo = memoize(selectGatheringTimeAll)
