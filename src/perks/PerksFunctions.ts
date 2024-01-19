import { CharAbilityAdapter } from '../activeAbilities/abilityAdapters'
import { CharAbility } from '../activeAbilities/abilityInterfaces'
import { CharacterAdapter } from '../characters/characterAdapter'
import { PLAYER_ID } from '../characters/charactersConst'
import { GameState } from '../game/GameState'
import { useGameStore } from '../game/state'
import { CollapsedEnum } from '../ui/sidebar/CollapsedEnum'
import { collapseInt, setCollapseInt } from '../ui/state/uiFunctions'
import { PerksData } from './Perk'
import { PerksEnum } from './perksEnum'

export const setPerk = (perk: PerksEnum) => () =>
    useGameStore.setState((s: GameState) => {
        s = { ...s, characters: CharacterAdapter.update(s.characters, s.ui.selectedCharId, { selectedPerk: perk }) }
        s = collapseInt(CollapsedEnum.PerkS)(s)
        return s
    })

const acquirePerk =
    (perk: PerksEnum, charId: string = PLAYER_ID) =>
    (state: GameState) => {
        const char = CharacterAdapter.selectEx(state.characters, charId)
        let perks = char.perks
        const have = perks[perk] ?? 0
        perks = { ...perks, [perk]: have + 1 }
        let allCombatAbilities = char.allCombatAbilities
        const perkData = PerksData[perk]
        if (perkData.abilityUnlock) {
            const charAbility: CharAbility = {
                id: `Perk${perk}`,
                abilityId: perkData.abilityUnlock,
                perkSource: perk,
            }
            allCombatAbilities = CharAbilityAdapter.upsertMerge(allCombatAbilities, charAbility)
        }
        state = {
            ...state,
            characters: CharacterAdapter.update(state.characters, charId, { perks, allCombatAbilities }),
        }
        return state
    }
export const acquirePerkClick = (perk: PerksEnum) => () => useGameStore.setState(acquirePerk(perk))
export const setPerksOpen = (open: boolean) =>
    useGameStore.setState((s: GameState) => {
        s = setCollapseInt(CollapsedEnum.PerkS, open)(s)
        return s
    })
