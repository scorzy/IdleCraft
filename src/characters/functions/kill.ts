import { addBattleLog } from '../../battleLog/functions/addBattleLog'
import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { addLoot } from '../../storage/function/addLoot'
import { CharacterAdapter } from '../characterAdapter'
import { getCharacterSelector } from '../getCharacterSelector'
import { removeCharacter } from './removeCharacter'

export function kill(state: GameState, targetId: string): GameState {
    const loot = CharacterAdapter.selectEx(state.characters, targetId).loot
    if (loot) state = addLoot(state, loot)
    const targets = getCharacterSelector(targetId).Name(state)
    state = addBattleLog(state, { type: 'kill', iconId: Icons.Skull, targets })
    state = removeCharacter(state, targetId)
    return state
}
