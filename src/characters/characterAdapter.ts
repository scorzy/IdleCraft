import { InitialState } from '../entityAdapter/InitialState'
import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'
import { characterSelectors } from './characterSelectorsMap'
import { CharacterState } from './characterState'
import { PLAYER_CHAR } from './charactersConst'

class CharacterAdapterInt extends AbstractEntityAdapter<CharacterState> {
    getId(data: CharacterState): string {
        return data.id
    }
    complete(data: object): CharacterState | null {
        let ret: CharacterState = structuredClone(PLAYER_CHAR)
        ret = { ...ret, ...data }
        return ret
    }

    remove(state: InitialState<CharacterState>, id: string) {
        const ret = super.remove(state, id)
        characterSelectors.delete(id)
        return ret
    }
}
export const CharacterAdapter = new CharacterAdapterInt()
