import { ActiveAbilityData } from '../../activeAbilities/ActiveAbilityData'
import { CastCharAbilityAdapter } from '../../activeAbilities/abilityAdapters'
import { InitialState } from '../../entityAdapter/entityAdapter'
import { GameState } from '../../game/GameState'
import { TimerAdapter } from '../../timers/Timer'
import { memoizeOne } from '../../utils/memoizeOne'
import { CharacterAdapter } from '../characterAdapter'
import { CharacterState } from '../characterState'

export const selectCharName = (charId: string) => (state: GameState) =>
    CharacterAdapter.selectEx(state.characters, charId).nameId
export const selectCharIcon = (charId: string) => (state: GameState) =>
    CharacterAdapter.selectEx(state.characters, charId).iconId
export const selectCharHealth = (charId: string) => (state: GameState) =>
    CharacterAdapter.selectEx(state.characters, charId).health
export const selectCharStamina = (charId: string) => (state: GameState) =>
    CharacterAdapter.selectEx(state.characters, charId).stamina
export const selectCharMana = (charId: string) => (state: GameState) =>
    CharacterAdapter.selectEx(state.characters, charId).mana
export const selectCharMainAttackTimer = (charId: string) => (state: GameState) => {
    const ability = CastCharAbilityAdapter.find(state.castCharAbility, (a) => a.characterId === charId)
    if (!ability) return
    return TimerAdapter.find(state.timers, (t) => t.actId === ability?.id)
}
export const selectCharMainAttack = (charId: string) => (state: GameState) => {
    return CastCharAbilityAdapter.find(state.castCharAbility, (a) => a.characterId === charId)
}
export const selectCharMainAttackIcon = (characterId: string) => (state: GameState) => {
    const cast = CastCharAbilityAdapter.find(state.castCharAbility, (a) => a.characterId === characterId)
    if (!cast) return
    const ability = ActiveAbilityData.getEx(cast.abilityId)
    return ability.getIconId({ state, characterId })
}

const selectCharactersTeamIdsInt = memoizeOne(
    (characters: InitialState<CharacterState>) =>
        CharacterAdapter.findMany(characters, (c) => !c.isEnemy)?.map((c) => c.id) ?? []
)
export const selectCharactersTeamIds = (state: GameState) => selectCharactersTeamIdsInt(state.characters)
