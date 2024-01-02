import { ReactNode } from 'react'
import { Icons } from '../../icons/Icons'
import { AbilityParams, AbilityResult, AbilityStartResult, ActiveAbility } from '../ActiveAbility'
import { Msg } from '../../msg/Msg'
import { CharacterStateAdapter } from '../../characters/characterAdapter'

export class NormalAttack implements ActiveAbility {
    id = 'NormalAttack'
    nameId = 'NormalAttack' as keyof Msg
    getDesc(params: AbilityParams): ReactNode {
        return 'NormalAttack'
    }
    getIconId(params: AbilityParams): Icons {
        return Icons.Axe
    }
    getChargeTime(params: AbilityParams): number {
        return 3e3
    }
    getHealthCost(params: AbilityParams): number {
        return 0
    }
    getStaminaCost(params: AbilityParams): number {
        return 0
    }
    getManaCost(params: AbilityParams): number {
        return 0
    }
    start(params: AbilityParams): AbilityStartResult {
        const { characterId, state } = params
        const char = CharacterStateAdapter.selectEx(state.characters, characterId)
        const enemy = CharacterStateAdapter.find(
            state.characters,
            (c) => (char.isEnemy && !c.isEnemy) || (!char.isEnemy && c.isEnemy)
        )

        if (!enemy) return { state, started: false }
        return { state, started: true }
    }
    exec(params: AbilityParams): AbilityResult {
        const { characterId, state } = params
        const char = CharacterStateAdapter.selectEx(state.characters, characterId)

        const enemy = CharacterStateAdapter.find(
            state.characters,
            (c) => (char.isEnemy && !c.isEnemy) || (!char.isEnemy && c.isEnemy)
        )

        if (!enemy) return { state }

        return { state }
    }
}
