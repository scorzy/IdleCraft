import { characterSelectors } from './characterSelectorsMap'
import { CharacterState } from './characterState'
import { makeCharacterSelector } from './makeCharacterSelector'

export const getCharacterSelector = (characterId: string, char?: CharacterState) => {
    let ret = characterSelectors.get(characterId)
    if (!ret) {
        ret = makeCharacterSelector(characterId, char)
        characterSelectors.set(characterId, ret)
    }
    return ret
}
