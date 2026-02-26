import { memoize as memoizeEs } from 'es-toolkit/function'
import { Bonus, BonusResult } from '../../bonus/Bonus'
import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { GatheringData } from '../gatheringData'
import { GatheringZone } from '../gatheringZones'

export const selectGatheringTime = memoizeEs((zone: GatheringZone) => {
    const gatheringTimeAll = (_state: GameState): BonusResult => {
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
    const gatheringTime = (state: GameState) => gatheringTimeAll(state).total

    return { gatheringTimeAll, gatheringTime }
})
