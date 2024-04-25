import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'
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
}
export const CharacterAdapter = new CharacterAdapterInt()
