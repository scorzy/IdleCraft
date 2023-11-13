import { ExpState } from '../experience/expState'
import { GameState } from '../game/GameState'
import { memoizeOne } from '../utils/memoizeOne'
import { PerksData } from './Perk'
import { PerkState } from './PerkState'
import { PerksEnum } from './perksEnum'

export const SelectPerk = (s: GameState) => s.ui.perk
export const IsPerkSelected = (perk: PerksEnum) => (s: GameState) => s.ui.perk === perk
export const SelectPerkLevel = (perk: PerksEnum) => (s: GameState) => s.perks[perk] ?? 0

const HasPerkInt = (perk: PerksEnum, perks: PerkState) => (perks[perk] ?? 0) > 0
export const HasPerk = (perk: PerksEnum) => (s: GameState) => (s.perks[perk] ?? 0) > 0

const IsPerkEnabledInt = memoizeOne((perkEnum: PerksEnum) =>
    memoizeOne((perks: PerkState, skills: ExpState) => {
        const perkData = PerksData[perkEnum]
        if (perkData.requiredExp?.some((r) => r.level > (skills[r.skill] ?? 0))) return false
        if (perkData.requiredPerks?.some((r) => !HasPerkInt(r, perks))) return false
        return true
    })
)

export const IsPerkEnabled = (perkEnum: PerksEnum) => (state: GameState) =>
    IsPerkEnabledInt(perkEnum)(state.perks, state.skillsLevel)

export const SelectMaxPerks = (s: GameState) => s.playerLevel
export const SelectUsedPerks = (s: GameState) => Object.values(s.perks).reduce((a, b) => a + b, 0)
export const SelectCanSpendPerks = (s: GameState) => SelectMaxPerks(s) - SelectUsedPerks(s) > 0
export const SelectPerkCompleted = (perkEnum: PerksEnum) => (state: GameState) => {
    const data = PerksData[perkEnum]
    return (state.perks[perkEnum] ?? 0) >= (data.max ?? 1)
}

const perksValues = Object.values(PerksEnum)

const selectPerksInt = memoizeOne(function selectPerksInt(
    perks: PerkState,
    skills: ExpState,
    available: boolean,
    unavailable: boolean,
    owned: boolean
): PerksEnum[] {
    if (available && unavailable && owned) return perksValues
    if (!available && !unavailable && !owned) return []

    return perksValues.filter((perk) => {
        const data = PerksData[perk]
        const isOwned = (perks[perk] ?? 0) >= (data.max ?? 1)
        if (owned && isOwned) return true

        const isAvailable = IsPerkEnabledInt(perk)(perks, skills)
        if (available && isAvailable && !isOwned) return true
        if (unavailable && !isAvailable) return true

        return false
    })
})

export const selectPerks = (state: GameState) =>
    selectPerksInt(
        state.perks,
        state.skillsLevel,
        state.ui.showAvailablePerks,
        state.ui.showUnavailablePerks,
        state.ui.showOwnedPerks
    )
