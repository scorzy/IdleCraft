import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'
import { CharacterState } from './characterState'

class CharacterStateAdapterInt extends AbstractEntityAdapter<CharacterState> {
    getId(data: CharacterState): string {
        return data.id
    }
}
export const CharacterStateAdapter = new CharacterStateAdapterInt()
