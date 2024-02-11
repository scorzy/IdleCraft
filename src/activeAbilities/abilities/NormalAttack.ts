import { ReactNode } from 'react'
import { Icons } from '../../icons/Icons'
import { Msg } from '../../msg/Msg'
import { AbilityParams, ActiveAbility } from '../ActiveAbility'
import { selectTranslations } from '../../msg/useTranslations'
import { selectCharacterAttackSpeed } from '../../characters/selectors/attackSpeedSelectors'
import { selectMainWeapon } from '../../characters/selectors/selectMainWeapon'
import { selectRandomEnemy } from '../../characters/functions/selectRandomEnemy'
import { CharacterAdapter } from '../../characters/characterAdapter'
import { GameState } from '../../game/GameState'
import { dealDamage } from '../../characters/functions/dealDamage'
import { selectCharacterAttackDamage } from '../../characters/selectors/attackDamageSelectors'
import { AbilitiesEnum } from '../abilitiesEnum'
import { selectDamageType } from '../../characters/selectors/selectDamageType'
import { addBattleLog } from '../../battleLog/functions/addBattleLog'
import { selectCharName } from '../../characters/selectors/characterSelectors'
import { addExp } from '../../experience/expFunctions'
import { DAMAGE_EXP_MULTI } from '../../const'

export class NormalAttack implements ActiveAbility {
    id = AbilitiesEnum.NormalAttack
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getStaminaCost(_params: AbilityParams): number {
        return 0
    }
    getManaCost(): number {
        return 0
    }

    getDamage(characterId: string, state: GameState): number {
        const damage = selectCharacterAttackDamage(characterId)(state)
        return damage
    }

    exec(params: AbilityParams): GameState {
        const { characterId } = params
        let { state } = params

        const caster = CharacterAdapter.selectEx(state.characters, characterId)
        const enemyId = selectRandomEnemy(state, caster.isEnemy)
        if (!enemyId) return state

        const damage = this.getDamage(characterId, state)
        const damageType = selectDamageType(characterId)(state)

        const source = selectCharName(params.characterId)(state)
        const targets = selectCharName(enemyId)(state)

        state = addBattleLog(state, {
            iconId: this.getIconId(params),
            abilityId: this.nameId,
            source,
            targets,
        })

        if (!caster.isEnemy) {
            const weapon = selectMainWeapon(characterId)(state)
            if (weapon && weapon.weaponData) state = addExp(state, weapon.weaponData.expType, damage * DAMAGE_EXP_MULTI)
        }

        const { state: gameState } = dealDamage(state, enemyId, damage, damageType)
        state = gameState

        return state
    }
}
