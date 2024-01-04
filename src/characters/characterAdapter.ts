import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'
import { CharacterState } from './characterState'

class CharacterAdapterInt extends AbstractEntityAdapter<CharacterState> {
    getId(data: CharacterState): string {
        return data.id
    }
}
export const CharacterAdapter = new CharacterAdapterInt()
