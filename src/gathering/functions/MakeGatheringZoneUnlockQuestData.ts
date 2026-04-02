import { CharTemplateEnum } from '../../characters/templates/characterTemplateEnum'
import { GameLocations } from '../../gameLocations/GameLocations'
import { GenerateQuestDataData } from '../../quests/QuestTemplate'
import { GatheringZone } from '../gatheringZones'

export interface GatheringZoneUnlockQuestData extends GenerateQuestDataData {
    enemies?: { qta: number; templateId: CharTemplateEnum }[]
}
export interface GatheringZoneUnlockQuestDataComplete extends GatheringZoneUnlockQuestData {
    location: GameLocations
    zone: GatheringZone
    enemies?: { qta: number; templateId: CharTemplateEnum }[]
}
