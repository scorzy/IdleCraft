import { Bonus, BonusResult } from '../../bonus/Bonus'
import { getTotal } from '../../bonus/BonusFunctions'
import { AppliedEffectAdapter } from '../../effects/types/AppliedEffect'
import { Effects } from '../../effects/types/Effects'
import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { CharacterAdapter } from '../characterAdapter'
import { CharacterState } from '../characterState'
import { selectMaxManaFromChar } from './manaSelectors'

export const selectMaxStaminaFromChar = (char: CharacterState) => {
    const points = char.staminaPoints
    const bonuses: Bonus[] = []
    bonuses.push({
        id: 'baseStamina',
        add: 100,
        iconId: Icons.Strong,
        nameId: 'Base',
    })
    if (points > -9)
        bonuses.push({
            id: 'basePoints',
            add: 10 * points,
            showQta: points,

            iconId: Icons.Strong,
            nameId: 'ManaPoints',
        })

    const bonusList: BonusResult = {
        bonuses,
        total: getTotal(bonuses),
    }

    return bonusList
}
export const selectMaxStaminaList = (state: GameState, charId: string) => {
    const char = CharacterAdapter.selectEx(state.characters, charId)

    const list = selectMaxManaFromChar(char)

    AppliedEffectAdapter.findMany(
        state.effects,
        (eff) => eff.effect === Effects.MaxStamina && eff.target === charId && eff.value !== undefined && eff.value > 0
    ).forEach((eff) => {
        list.bonuses.push({
            id: eff.id,
            add: eff.value || 0,
            iconId: eff.iconId,
            nameId: eff.nameId,
        })
    })
    list.total = getTotal(list.bonuses)
    return list
}
export const selectStaminaRegenList = (state: GameState, charId: string) => {
    const bonuses: Bonus[] = []
    bonuses.push({
        id: 'baseStaminaRegen',
        add: 0.5,
        iconId: Icons.Heart,
        nameId: 'Base',
    })
    AppliedEffectAdapter.findMany(
        state.effects,
        (eff) =>
            eff.effect === Effects.RegenStamina && eff.target === charId && eff.value !== undefined && eff.value > 0
    ).forEach((eff) => {
        bonuses.push({
            id: eff.id,
            add: eff.value,
            iconId: eff.iconId,
            nameId: eff.nameId,
        })
    })
    AppliedEffectAdapter.findMany(
        state.effects,
        (eff) =>
            eff.effect === Effects.DamageRegenStamina &&
            eff.target === charId &&
            eff.value !== undefined &&
            eff.value < 0
    ).forEach((eff) => {
        bonuses.push({
            id: eff.id,
            add: eff.value,
            iconId: eff.iconId,
            nameId: eff.nameId,
        })
    })
    const bonusList: BonusResult = {
        bonuses,
        total: getTotal(bonuses),
    }
    return bonusList
}
