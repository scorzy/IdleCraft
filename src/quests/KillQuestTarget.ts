import { CharTemplateEnum } from '../characters/templates/characterTemplateEnum'

export interface KillQuestTarget {
    targetId: CharTemplateEnum
    targetCount: number
    killedCount: number
    locationId?: string
}
