import { memoize } from 'proxy-memoize'
import { GameState } from '../game/GameState'
import { CharacterAdapter } from './characterAdapter'
import { CharacterSelector } from './CharacterSelector'

export const makeCharacterSelector: (characterId: string) => CharacterSelector = (characterId: string) => {
    const selectCharLevel = memoize(function (state: GameState): number {
        return CharacterAdapter.selectEx(state.characters, characterId).level
    })

    return { selectCharLevel }
}
