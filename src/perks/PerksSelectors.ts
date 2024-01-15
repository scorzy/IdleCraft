import { CharacterAdapter } from '../characters/characterAdapter'
import { PLAYER_ID } from '../characters/charactersConst'
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
export const hasPerk =
    (perk: PerksEnum, charId: string = PLAYER_ID) =>
    (s: GameState) =>
        (s.characters.entries[charId]?.perks[perk] ?? 0) > 0

const IsPerkEnabledInt = memoize((perkEnum: PerksEnum) =>
    memoizeOne((perks: PerkState, skills: ExpState) => {
        const perkData = PerksData[perkEnum]
        if (perkData.requiredExp?.some((r) => r.level > (skills[r.skill] ?? 0))) return false
        if (perkData.requiredPerks?.some((r) => !hasPerkInt(r, perks))) return false
        return true
    })
)

export const IsPerkEnabled =
    (perkEnum: PerksEnum, charId: string = PLAYER_ID) =>
    (state: GameState) =>
        IsPerkEnabledInt(perkEnum)(CharacterAdapter.selectEx(state.characters, charId).perks, selectPlayerExp(state))

export const SelectMaxPerks =
    (charId: string = PLAYER_ID) =>
    (s: GameState) =>
        selectPlayerLevel(s, charId)
export const SelectUsedPerks =
    (charId: string = PLAYER_ID) =>
    (s: GameState) =>
        Object.values(CharacterAdapter.selectEx(s.characters, charId).perks).reduce((a, b) => a + b, 0)
export const SelectCanSpendPerks =
    (charId: string = PLAYER_ID) =>
    (s: GameState) =>
        SelectMaxPerks(charId)(s) - SelectUsedPerks(charId)(s) > 0
export const SelectPerkCompleted =
    (perkEnum: PerksEnum, charId: string = PLAYER_ID) =>
    (state: GameState) => {
        const data = PerksData[perkEnum]
        return (CharacterAdapter.selectEx(state.characters, charId).perks[perkEnum] ?? 0) >= (data.max ?? 1)
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

export const selectPerks =
    (charId: string = PLAYER_ID) =>
    (state: GameState) =>
        selectPerksInt(
            CharacterAdapter.selectEx(state.characters, charId).perks,
            selectPlayerExp(state),
            state.ui.showAvailablePerks,
            state.ui.showUnavailablePerks,
            state.ui.showOwnedPerks
        )
