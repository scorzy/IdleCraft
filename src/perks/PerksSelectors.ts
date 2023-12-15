import { ExpState } from '../experience/ExpState'
import { selectPlayerExp, selectPlayerLevel } from '../experience/expSelectors'
import { GameState } from '../game/GameState'
import { memoize } from '../utils/memoize'
import { memoizeOne } from '../utils/memoizeOne'
import { PerksData } from './Perk'
import { PerkState } from './PerkState'
import { PerksEnum } from './perksEnum'

export const SelectPerk = (s: GameState) => s.ui.perk
export const IsPerkSelected = (perk: PerksEnum) => (s: GameState) => s.ui.perk === perk

const hasPerkInt = (perk: PerksEnum, perks: PerkState) => (perks[perk] ?? 0) > 0
export const hasPerk = (perk: PerksEnum) => (s: GameState) => (s.perks[perk] ?? 0) > 0

const IsPerkEnabledInt = memoize((perkEnum: PerksEnum) =>
    memoizeOne((perks: PerkState, skills: ExpState) => {
        const perkData = PerksData[perkEnum]
        if (perkData.requiredExp?.some((r) => r.level > (skills[r.skill] ?? 0))) return false
        if (perkData.requiredPerks?.some((r) => !hasPerkInt(r, perks))) return false
        return true
    })
)

export const IsPerkEnabled = (perkEnum: PerksEnum) => (state: GameState) =>
    IsPerkEnabledInt(perkEnum)(state.perks, selectPlayerExp(state))

export const SelectMaxPerks = (s: GameState) => selectPlayerLevel(s)
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
        selectPlayerExp(state),
        state.ui.showAvailablePerks,
        state.ui.showUnavailablePerks,
        state.ui.showOwnedPerks
    )
