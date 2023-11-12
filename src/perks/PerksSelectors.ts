import { getLevel } from '../experience/expFunctions'
import { GameState } from '../game/GameState'
import { PerksData } from './Perk'
import { PerksEnum } from './perksEnum'

export const SelectPerk = (s: GameState) => s.ui.perk
export const IsPerkSelected = (perk: PerksEnum) => (s: GameState) => s.ui.perk === perk
export const SelectPerkLevel = (perk: PerksEnum) => (s: GameState) => s.perks[perk] ?? 0
export const HasPerkLevel = (perk: PerksEnum) => (s: GameState) => (s.perks[perk] ?? 0) > 0
export const IsPerkEnabled = (perkEnum: PerksEnum) => (state: GameState) => {
    const perkData = PerksData[perkEnum]
    if (perkData.requiredExp?.some((r) => r.level > getLevel(state, r.skill))) return false
    if (perkData.requiredPerks?.some((r) => !HasPerkLevel(r)(state))) return false
    return true
}
