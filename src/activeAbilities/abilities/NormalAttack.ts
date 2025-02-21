import { ReactNode } from 'react'
import { Icons } from '../../icons/Icons'
import { Msg } from '../../msg/Msg'
import { AbilityParams, ActiveAbility } from '../ActiveAbility'
import { selectTranslations } from '../../msg/useTranslations'
import { selectRandomEnemy } from '../../characters/functions/selectRandomEnemy'
import { CharacterAdapter } from '../../characters/characterAdapter'
import { GameState } from '../../game/GameState'
import { dealDamage } from '../../characters/functions/dealDamage'
import { AbilitiesEnum } from '../abilitiesEnum'
import { addExp } from '../../experience/expFunctions'
import { DAMAGE_EXP_MULTI } from '../../const'
import { DamageData } from '../../items/Item'
import { sumDamage } from '../functions/sumDamage'
import { getCharacterSelector } from '../../characters/getCharacterSelector'
import { addBattleLog } from '../../battleLog/functions/addbattleLog'

export class NormalAttack implements ActiveAbility {
    id = AbilitiesEnum.NormalAttack
    nameId = 'NormalAttack' as keyof Msg
    getDesc(params: AbilityParams): ReactNode {
        const t = selectTranslations(params.state)
        return t.t.NormalAttackDesc
    }
    getIconId(params: AbilityParams): Icons {
        const weapon = getCharacterSelector(params.characterId).MainWeapon(params.state)
        return weapon?.icon ?? Icons.Punch
    }
    getChargeTime(params: AbilityParams): number {
        return getCharacterSelector(params.characterId).AttackSpeed(params.state)
    }
    getHealthCost(): number {
        return 0
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getStaminaCost(_params: AbilityParams): number {
        return 0
    }
    getManaCost(): number {
        return 0
    }

    getDamage(characterId: string, state: GameState): DamageData {
        return getCharacterSelector(characterId).AllAttackDamage(state)
    }

    exec(params: AbilityParams): GameState {
        const { characterId } = params
        let { state } = params

        const caster = CharacterAdapter.selectEx(state.characters, characterId)
        const enemyId = selectRandomEnemy(state, caster.isEnemy)
        if (!enemyId) return state

        const damage = this.getDamage(characterId, state)

        getCharacterSelector(params.characterId).Name(state)

        const source = getCharacterSelector(params.characterId).Name(state)
        const targets = getCharacterSelector(enemyId).Name(state)

        state = addBattleLog(state, {
            iconId: this.getIconId(params),
            abilityId: this.nameId,
            source,
            targets,
        })

        if (!caster.isEnemy) {
            const weapon = getCharacterSelector(characterId).MainWeapon(state)
            if (weapon && weapon.weaponData)
                state = addExp(state, weapon.weaponData.expType, sumDamage(damage) * DAMAGE_EXP_MULTI)
        }

        const { state: gameState } = dealDamage(state, enemyId, damage)
        state = gameState

        return state
    }
}
