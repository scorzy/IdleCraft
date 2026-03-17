import { CharTemplateEnum } from '../../characters/templates/characterTemplateEnum'
import { GameLocations } from '../../gameLocations/GameLocations'
import { GenerateQuestDataData } from '../../quests/QuestTemplate'
import { GatheringZone } from '../gatheringZones'

export interface MakeGatheringZoneUnlockQuestData extends GenerateQuestDataData {
    location: GameLocations
    zone: GatheringZone
    enemies: { qta: number; templateId: CharTemplateEnum }[]
}
