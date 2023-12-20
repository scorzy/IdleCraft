import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'
import { CharAbility } from './types/CharAbility'

class CharAbilityAdapterInt extends AbstractEntityAdapter<CharAbility> {
    getId(data: CharAbility): string {
        return data.id
    }
}
export const CharAbilityAdapter = new CharAbilityAdapterInt()
