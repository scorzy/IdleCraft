import { ExpEnum } from '../../experience/ExpEnum'
import { GameState } from '../../game/GameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { QuestAdapter } from '../../quests/QuestTypes'
import { GatheringData } from '../gatheringData'
import { getGatheringQuestId } from '../selectors/gatheringSelectors'
import { UnlockZoneQuest } from './UnlockZoneQuest'

export const startGatheringQuest = (state: GameState, expType: ExpEnum, prevLevel: number, newLevel: number) => {
    if (expType !== ExpEnum.Gathering) return
    if (prevLevel >= newLevel) return

    Object.values(GameLocations).forEach((location) => {
        const unlockedZone = state.locations[location].unlockedGatheringZones

        Object.values(GatheringData).forEach((zoneConfig) => {
            if (
                !(
                    zoneConfig.unlockData &&
                    zoneConfig.unlockData.requiredLevel <= newLevel &&
                    !unlockedZone.includes(zoneConfig.zone)
                )
            )
                return

            if (!zoneConfig.unlockData.questData) {
                unlockedZone.push(zoneConfig.zone)
                return
            }
            if (QuestAdapter.select(state.quests, getGatheringQuestId(zoneConfig.zone, location))) return

            if (!zoneConfig.unlockData) return

            const unlockQuest = new UnlockZoneQuest().generateQuestData(state, {
                location,
                zone: zoneConfig.zone,
                ...zoneConfig.unlockData.questData,
            })

            QuestAdapter.create(state.quests, unlockQuest)
        })
    })
}
