import { CharTemplatesData } from '../characters/templates/charTemplateData'

export interface KillQuestTarget {
    targetId: keyof typeof CharTemplatesData
    targetCount: number
    killedCount: number
    locationId?: string
}
