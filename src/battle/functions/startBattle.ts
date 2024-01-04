import { ActivityStartResult } from '../../activities/activityInterfaces'
import { makeStartActivity } from '../../activities/functions/makeStartActivity'
import { CharacterAdapter } from '../../characters/characterAdapter'
import { createEnemies } from '../../characters/functions/createEnemies'
import { startNextAbility } from '../../characters/functions/startNextAbility'
import { GameState } from '../../game/GameState'
import { BattleAdapter } from '../BattleAdapter'
import { BattleZones } from '../BattleZones'

export const startBattle = makeStartActivity((state: GameState, id: string) => {
    const data = BattleAdapter.selectEx(state.battle, id)
    const battleZone = BattleZones[data.battleZoneEnum]

    state = createEnemies(state, battleZone.enemies)

    const charIds = CharacterAdapter.getIds(state.characters)
    charIds.forEach((charId) => {
        state = startNextAbility(state, charId)
    })

    return { state, result: ActivityStartResult.Started }
})
