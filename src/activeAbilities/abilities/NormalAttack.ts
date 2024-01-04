import { ReactNode } from 'react'
import { Icons } from '../../icons/Icons'
import { Msg } from '../../msg/Msg'
import { AbilityParams, ActiveAbility } from '../ActiveAbility'
import { NORMAL_ATTACK_ID } from '../abilityConst'
import { selectTranslations } from '../../msg/useTranslations'
import { selectCharacterAttackSpeed } from '../../characters/selectors/attackSpeedSelectors'
import { selectMainWeapon } from '../../characters/selectors/selectMainWeapon'
import { selectRandomEnemy } from '../../characters/functions/selectRandomEnemy'
import { CharacterAdapter } from '../../characters/characterAdapter'
import { GameState } from '../../game/GameState'
import { dealDamage } from '../../characters/functions/dealDamage'
import { selectCharacterAttackDamage } from '../../characters/selectors/attackDamageSelectors'

export class NormalAttack implements ActiveAbility {
    id = NORMAL_ATTACK_ID
    nameId = 'NormalAttack' as keyof Msg
    getDesc(params: AbilityParams): ReactNode {
        const t = selectTranslations(params.state)
        return t.t.NormalAttackDesc
    }
    getIconId(params: AbilityParams): Icons {
        const weapon = selectMainWeapon(params.characterId)(params.state)
        return weapon?.icon ?? Icons.Punch
    }
    getChargeTime(params: AbilityParams): number {
        return selectCharacterAttackSpeed(params.characterId)(params.state)
    }
    getHealthCost(): number {
        return 0
    }
    getStaminaCost(): number {
        return 0
    }
    getManaCost(): number {
        return 0
    }

    exec(params: AbilityParams): GameState {
        const { characterId } = params
        let { state } = params

        const caster = CharacterAdapter.selectEx(state.characters, params.characterId)
        const enemyId = selectRandomEnemy(state, caster.isEnemy)
        if (!enemyId) return state

        const damage = selectCharacterAttackDamage(characterId)(state)
        const { state: gameState } = dealDamage(state, enemyId, damage)
        state = gameState

        return state
    }
}
