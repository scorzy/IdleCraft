import { ReactNode } from 'react'
import { Icons } from '../../icons/Icons'
import { Msg } from '../../msg/Msg'
import { AbilityParams } from '../ActiveAbility'
import { CHARGED_ATTACK_DAMAGE_BONUS, CHARGED_ATTACK_STAMINA, CHARGED_ATTACK_TIME } from '../abilityConst'
import { selectTranslations } from '../../msg/useTranslations'
import { GameState } from '../../game/GameState'
import { AbilitiesEnum } from '../abilitiesEnum'
import { DamageData } from '../../items/Item'
import { multiplyDamage } from '../functions/multiplyDamage'
import { getCharacterSelector } from '../../characters/getCharacterSelector'
import { NormalAttack } from './NormalAttack'

export class ChargedAttack extends NormalAttack {
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
        return getCharacterSelector(params.characterId).AttackSpeed(params.state) * CHARGED_ATTACK_TIME
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
    getDamage(characterId: string, state: GameState): DamageData {
        return multiplyDamage(getCharacterSelector(characterId).AllAttackDamage(state), CHARGED_ATTACK_DAMAGE_BONUS)
    }
}
