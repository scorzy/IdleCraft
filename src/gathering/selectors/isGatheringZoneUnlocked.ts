import { PLAYER_ID } from '../../characters/charactersConst'
import { selectLevel } from '../../experience/expSelectors'
import { ExpEnum } from '../../experience/ExpEnum'
import { GameState } from '../../game/GameState'
import { GatheringData } from '../gatheringData'
import { GatheringZone } from '../gatheringZones'

export const isGatheringZoneUnlocked = (zone: GatheringZone) => (state: GameState) => {
    if (state.unlockedGatheringZones[zone]) return true

    const data = GatheringData[zone]
    if (data.unlocked) return true

    const level = selectLevel(ExpEnum.Gathering, PLAYER_ID)(state)
    return level >= data.requiredLevel
}
