import { Bonus, BonusResult } from '../../bonus/Bonus'
import { getTotal } from '../../bonus/BonusFunctions'
import { AppliedEffectAdapter } from '../../effects/types/AppliedEffect'
import { Effects } from '../../effects/types/Effects'
import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { CharacterAdapter } from '../characterAdapter'
import { CharacterState } from '../characterState'

export const selectMaxManaFromChar = (char: CharacterState) => {
    const points = char.manaPoints
    const bonuses: Bonus[] = []
    bonuses.push({
        id: 'baseMana',
        add: 100,
        iconId: Icons.MagicPalm,
        nameId: 'Base',
    })
    if (points > 0)
        bonuses.push({
            id: 'basePoints',
            add: 10 * points,
            showQta: points,
            iconId: Icons.MagicPalm,
            nameId: 'ManaPoints',
        })

    const bonusList: BonusResult = {
        bonuses,
        total: getTotal(bonuses),
    }

    return bonusList
}
export const selectMaxManaList = (state: GameState, charId: string) => {
    const char = CharacterAdapter.selectEx(state.characters, charId)

    const list = selectMaxManaFromChar(char)

    AppliedEffectAdapter.findMany(
        state.effects,
        (eff) => eff.effect === Effects.MaxMana && eff.target === charId && eff.value !== undefined && eff.value > 0
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
export const selectManaRegenList = (state: GameState, charId: string) => {
    const bonuses: Bonus[] = []
    bonuses.push({
        id: 'baseManaRegen',
        add: 0.5,
        iconId: Icons.Heart,
        nameId: 'Base',
    })
    AppliedEffectAdapter.findMany(
        state.effects,
        (eff) => eff.effect === Effects.RegenMana && eff.target === charId && eff.value !== undefined && eff.value > 0
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
            eff.effect === Effects.DamageRegenMana && eff.target === charId && eff.value !== undefined && eff.value < 0
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
