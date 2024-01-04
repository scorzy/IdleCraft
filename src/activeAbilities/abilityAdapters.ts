import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'
import { CastCharAbility, CharAbility } from './abilityInterfaces'

class CharAbilityAdapterInt extends AbstractEntityAdapter<CharAbility> {
    getId(data: CharAbility): string {
        return data.id
    }
}
export const CharAbilityAdapter = new CharAbilityAdapterInt()

class CastCharAbilityAdapterInt extends AbstractEntityAdapter<CastCharAbility> {
    getId(data: CastCharAbility): string {
        return data.id
    }
}
export const CastCharAbilityAdapter = new CastCharAbilityAdapterInt()
