import { CharacterAdapter } from '../../characters/characterAdapter'
import { CharTemplateEnum } from '../../characters/templates/characterTemplateEnum'
import { GameState } from '../../game/GameState'
import { GatheringZone } from '../gatheringZones'

const WOLF_LAIR_UNLOCK_KILLS = 10

export const wolfLairUnlockOnKill = (state: GameState, killedCharId: string): void => {
    const killedChar = CharacterAdapter.selectEx(state.characters, killedCharId)
    if (killedChar.templateId !== CharTemplateEnum.Wolf) return

    const oldKills = state.killedMonstersByZone[GatheringZone.WolfLair] ?? 0
    const newKills = oldKills + 1

    state.killedMonstersByZone[GatheringZone.WolfLair] = newKills

    if (newKills >= WOLF_LAIR_UNLOCK_KILLS) state.unlockedGatheringZones[GatheringZone.WolfLair] = true
}
