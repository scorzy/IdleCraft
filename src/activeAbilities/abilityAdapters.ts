import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'
import { AbilitiesEnum } from './abilitiesEnum'
import { CastCharAbility, CharAbility } from './abilityInterfaces'
import { InitialState } from '@/entityAdapter/InitialState'

class CharAbilityAdapterInt extends AbstractEntityAdapter<CharAbility> {
    getId(data: CharAbility): string {
        return data.id
    }
    getInitialState(): InitialState<CharAbility> {
        return {
            ids: [AbilitiesEnum.NormalAttack],
            entries: {
                [AbilitiesEnum.NormalAttack]: {
                    id: AbilitiesEnum.NormalAttack,
                    abilityId: AbilitiesEnum.NormalAttack,
                },
            },
        }
    }
}
export const CharAbilityAdapter = new CharAbilityAdapterInt()

class CastCharAbilityAdapterInt extends AbstractEntityAdapter<CastCharAbility> {
    getId(data: CastCharAbility): string {
        return data.id
    }
}
export const CastCharAbilityAdapter = new CastCharAbilityAdapterInt()
