import { characterSelectors } from './characterSelectorsMap'
import { makeCharacterSelector } from './makeCharacterSelector'

export const getCharacterSelector = (characterId: string) => {
    let ret = characterSelectors.get(characterId)
    if (!ret) {
        ret = makeCharacterSelector(characterId)
        characterSelectors.set(characterId, ret)
    }
    return ret
}
