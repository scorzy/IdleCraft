import { CharAbilityAdapter } from '../activeAbilities/abilityAdapters'
import { CharAbility } from '../activeAbilities/abilityInterfaces'
import { CharacterAdapter } from '../characters/characterAdapter'
import { PLAYER_ID } from '../characters/charactersConst'
import { GameState } from '../game/GameState'
import { setState } from '../game/setState'
import { CollapsedEnum } from '../ui/sidebar/CollapsedEnum'
import { collapseInt, setCollapseInt } from '../ui/state/uiFunctions'
import { PerksData } from './Perk'
import { PerksEnum } from './perksEnum'

export const setPerk = (perk: PerksEnum) => () =>
    setState((s: GameState) => {
        CharacterAdapter.selectEx(s.characters, s.ui.selectedCharId).selectedPerk = perk
        collapseInt(CollapsedEnum.PerkS)(s)
    })

const acquirePerk =
    (perk: PerksEnum, charId: string = PLAYER_ID) =>
    (state: GameState) => {
        const char = CharacterAdapter.selectEx(state.characters, charId)
        const perks = char.perks
        perks[perk] = (perks[perk] ?? 0) + 1
        const allCombatAbilities = char.allCombatAbilities
        const perkData = PerksData[perk]
        if (perkData.abilityUnlock) {
            const charAbility: CharAbility = {
                id: `Perk${perk}`,
                abilityId: perkData.abilityUnlock,
                perkSource: perk,
            }
            CharAbilityAdapter.upsertMerge(allCombatAbilities, charAbility)
        }
    }
export const acquirePerkClick = (perk: PerksEnum) => () => setState(acquirePerk(perk))
export const setPerksOpen = (open: boolean) => setState((s: GameState) => setCollapseInt(CollapsedEnum.PerkS, open)(s))
