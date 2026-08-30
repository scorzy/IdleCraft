import { CharacterId } from '../characters/templates/characterRegistry'

export interface KillQuestTarget {
    targetId: CharacterId
    targetCount: number
    killedCount: number
    locationId?: string
}
