import { CharacterId } from '../../characters/templates/characterRegistry'
import { GameLocations } from '../../gameLocations/GameLocations'
import { GenerateQuestDataData } from '../../quests/QuestTemplate'
import { GatheringZone } from '../gatheringZones'

export interface GatheringZoneUnlockQuestData extends GenerateQuestDataData {
    enemies?: { qta: number; templateId: CharacterId }[]
}
export interface GatheringZoneUnlockQuestDataComplete extends GatheringZoneUnlockQuestData {
    location: GameLocations
    zone: GatheringZone
    enemies?: { qta: number; templateId: CharacterId }[]
}
