import { ReactNode } from 'react'
import { Icons } from '../../icons/Icons'
import { Msg } from '../../msg/Msg'
import { AbilityParams, ActiveAbility } from '../ActiveAbility'
import { CHARGED_ATTACK_DAMAGE_BONUS, CHARGED_ATTACK_STAMINA, CHARGED_ATTACK_TIME } from '../abilityConst'
import { selectTranslations } from '../../msg/useTranslations'
import { selectCharacterAttackSpeed } from '../../characters/selectors/attackSpeedSelectors'
import { selectRandomEnemy } from '../../characters/functions/selectRandomEnemy'
import { CharacterAdapter } from '../../characters/characterAdapter'
import { GameState } from '../../game/GameState'
import { dealDamage } from '../../characters/functions/dealDamage'
import { selectCharacterAttackDamage } from '../../characters/selectors/attackDamageSelectors'
import { AbilitiesEnum } from '../abilitiesEnum'

export class ChargedAttack implements ActiveAbility {
    id = AbilitiesEnum.ChargedAttack
    nameId = 'ChargedAttack' as keyof Msg
    getDesc(params: AbilityParams): ReactNode {
        const t = selectTranslations(params.state)
        return t.t.ChargedAttackDesc
    }
    getIconId(): Icons {
        return Icons.SaberSlash
    }
    getChargeTime(params: AbilityParams): number {
        return selectCharacterAttackSpeed(params.characterId)(params.state) * CHARGED_ATTACK_TIME
    }
    getHealthCost(): number {
        return 0
    }
    getStaminaCost(params: AbilityParams): number {
        const ret = (this.getChargeTime(params) * CHARGED_ATTACK_STAMINA) / 1e3

        return ret
    }
    getManaCost(): number {
        return 0
    }

    exec(params: AbilityParams): GameState {
        const { characterId } = params
        let { state } = params

        const caster = CharacterAdapter.selectEx(state.characters, characterId)
        const enemyId = selectRandomEnemy(state, caster.isEnemy)
        if (!enemyId) return state

        const damage = selectCharacterAttackDamage(characterId)(state) * CHARGED_ATTACK_DAMAGE_BONUS
        const { state: gameState } = dealDamage(state, enemyId, damage)
        state = gameState

        return state
    }
}
