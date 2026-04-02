import { GameState } from '../../game/GameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { QuestAdapter } from '../../quests/QuestTypes'
import { GatheringData } from '../gatheringData'
import { GatheringZone } from '../gatheringZones'

export const isGatheringZoneUnlocked = (state: GameState) => {
    const data = GatheringData[state.ui.gatheringZone]
    if (!data) return false

    if (data.unlockData === undefined) return true

    return state.locations[state.location].unlockedGatheringZones.includes(state.ui.gatheringZone)
}

export const getGatheringQuestId = (zone: GatheringZone, location: GameLocations) => {
    return `Gathering${zone}${location}`
}
export const selectActiveGatheringQuestId = (state: GameState) => {
    const zone = state.ui.gatheringZone
    const location = state.location
    const id = `Gathering${zone}${location}`
    return QuestAdapter.select(state.quests, id)?.id
}
export const selectGatheringUnlockLevel = (state: GameState) => {
    const zone = state.ui.gatheringZone
    const data = GatheringData[zone]
    if (!data) return 0
    return data.unlockData?.requiredLevel ?? 0
}
