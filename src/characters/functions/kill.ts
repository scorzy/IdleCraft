import { AddKillBattleLog, BattleLogType } from '../../battleLog/battleLogInterfaces'
import { addBattleLog } from '../../battleLog/functions/addBattleLog'
import { GameState } from '../../game/GameState'
import { addLoot } from '../../storage/function/addLoot'
import { CharacterAdapter } from '../characterAdapter'
import { getCharacterSelector } from '../getCharacterSelector'
import { removeCharacter } from './removeCharacter'

export function kill(state: GameState, targetId: string): GameState {
    const loot = CharacterAdapter.selectEx(state.characters, targetId).loot
    if (loot) state = addLoot(state, loot)
    const targets = getCharacterSelector(targetId).Name(state)
    const killLog: AddKillBattleLog = { type: BattleLogType.Kill, targets }
    state = addBattleLog(state, killLog)
    state = removeCharacter(state, targetId)
    return state
}
