import { CharacterAdapter } from '../characters/characterAdapter'
import { GameState } from '../game/GameState'
import { addRequirementProgress } from '../requirements/requirementFunctions'
import { addZoneExp, GatheringZoneExpConfig } from './zoneExperience'
import { getSubZoneMainZone } from './zoneProgression'

export function gatheringOnKillListener(state: GameState, killedCharId: string): void {
    const templateId = CharacterAdapter.selectEx(state.characters, killedCharId).templateId
    addRequirementProgress(state.requirementProgress.kills, templateId, 1)

    const killedLevel = CharacterAdapter.selectEx(state.characters, killedCharId).level
    const zone = getSubZoneMainZone(state.ui.gatheringZone)
    addZoneExp(state, zone, killedLevel * GatheringZoneExpConfig.monsterLevelMultiplier)
}

export function gatheringOnItemRemoved(state: GameState, itemId: string, _location: unknown, quantity: number): void {
    addRequirementProgress(state.requirementProgress.consumed, itemId, quantity)
}
