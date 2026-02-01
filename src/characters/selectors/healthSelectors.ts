import { Bonus, BonusResult } from '../../bonus/Bonus'
import { getTotal } from '../../bonus/BonusFunctions'
import { AppliedEffectAdapter } from '../../effects/types/AppliedEffect'
import { Effects } from '../../effects/types/Effects'
import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { CharacterAdapter } from '../characterAdapter'
import { CharacterState } from '../characterState'

export const selectMaxHealthFromChar = (char: CharacterState) => {
    const points = char.healthPoints
    const bonuses: Bonus[] = []
    bonuses.push({
        id: 'baseHealth',
        add: 100,
        iconId: Icons.Heart,
        nameId: 'Base',
    })
    if (points >= -9)
        bonuses.push({
            id: 'basePoints',
            add: 10 * points,
            showQta: points,
            iconId: Icons.HeartPlus,
            nameId: 'healthPoints',
        })

    const bonusList: BonusResult = {
        bonuses,
        total: getTotal(bonuses),
    }

    return bonusList
}
export const selectMaxHealthList = (state: GameState, charId: string) => {
    const char = CharacterAdapter.selectEx(state.characters, charId)

    const list = selectMaxHealthFromChar(char)

    AppliedEffectAdapter.findMany(
        state.effects,
        (eff) => eff.effect === Effects.MaxHealth && eff.target === charId && eff.value !== undefined && eff.value > 0
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
export const selectHealthRegenList = (state: GameState, charId: string) => {
    const bonuses: Bonus[] = []
    bonuses.push({
        id: 'baseHealthRegen',
        add: 0.5,
        iconId: Icons.Heart,
        nameId: 'Base',
    })
    AppliedEffectAdapter.findMany(
        state.effects,
        (eff) =>
            eff.effect === Effects.RegenHealth &&
            eff.target !== undefined &&
            eff.target === charId &&
            eff.value !== undefined &&
            eff.value > 0
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
            eff.effect === Effects.DamageRegenHealth &&
            eff.target !== undefined &&
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
