import { createSelector } from 'reselect'
import { CharacterAdapter } from '../characters/characterAdapter'
import { PLAYER_ID } from '../characters/charactersConst'
import { ExpState } from '../experience/ExpState'
import { selectPlayerExp, selectPlayerLevel } from '../experience/expSelectors'
import { GameState } from '../game/GameState'
import { selectSelectedCharId } from '../ui/state/uiSelectors'
import { PerksData } from './Perk'
import { PerkState } from './PerkState'
import { PerksEnum } from './perksEnum'

export const selectPerk = (s: GameState) => s.characters.entries[s.ui.selectedCharId]?.selectedPerk
export const isPerkSelected = (perk: PerksEnum) => (s: GameState) => selectPerk(s) === perk

const hasPerkInt = (perk: PerksEnum, perks: PerkState) => (perks[perk] ?? 0) > 0
export const hasPerk =
    (perk: PerksEnum, charId: string = PLAYER_ID) =>
    (s: GameState) =>
        (s.characters.entries[charId]?.perks[perk] ?? 0) > 0

const isPerkEnabledInt = (perks: PerkState, skills: ExpState, perkEnum: PerksEnum) => {
    const perkData = PerksData[perkEnum]
    if (perkData.requiredExp?.some((r) => r.level > (skills[r.skill] ?? 0))) return false
    if (perkData.requiredPerks?.some((r) => !hasPerkInt(r, perks))) return false
    return true
}

export const isPerkEnabled = createSelector(
    [
        (state: GameState) => CharacterAdapter.selectEx(state.characters, selectSelectedCharId(state)).perks,
        (state: GameState) => selectPlayerExp(state, selectSelectedCharId(state)),
        (_state: GameState, perkEnum: PerksEnum) => perkEnum,
    ],
    isPerkEnabledInt
)

export const selectMaxPerks =
    (charId: string = PLAYER_ID) =>
    (s: GameState) =>
        selectPlayerLevel(s, charId)
export const selectUsedPerks =
    (charId: string = PLAYER_ID) =>
    (s: GameState) =>
        Object.values(CharacterAdapter.selectEx(s.characters, charId).perks).reduce((a, b) => a + b, 0)
export const selectCanSpendPerks =
    (charId: string = PLAYER_ID) =>
    (s: GameState) =>
        selectMaxPerks(charId)(s) - selectUsedPerks(charId)(s) > 0
export const selectPerkCompleted =
    (perkEnum: PerksEnum, charId: string = PLAYER_ID) =>
    (state: GameState) => {
        const data = PerksData[perkEnum]
        return (CharacterAdapter.selectEx(state.characters, charId).perks[perkEnum] ?? 0) >= (data.max ?? 1)
    }

const perksValues = Object.values(PerksEnum)

export const selectPerks = createSelector(
    [
        (state: GameState) => CharacterAdapter.selectEx(state.characters, selectSelectedCharId(state)).perks,
        (state: GameState) => selectPlayerExp(state, selectSelectedCharId(state)),
        (state: GameState) => state.ui.showAvailablePerks,
        (state: GameState) => state.ui.showUnavailablePerks,
        (state: GameState) => state.ui.showOwnedPerks,
    ],
    (perks, skills, available, unavailable, owned) => {
        if (available && unavailable && owned) return perksValues
        if (!available && !unavailable && !owned) return []

        return perksValues.filter((perk) => {
            const data = PerksData[perk]
            const isOwned = (perks[perk] ?? 0) >= (data.max ?? 1)
            if (owned && isOwned) return true

            const isAvailable = isPerkEnabledInt(perks, skills, perk)
            if (available && isAvailable && !isOwned) return true
            if (unavailable && !isAvailable) return true

            return false
        })
    }
)
