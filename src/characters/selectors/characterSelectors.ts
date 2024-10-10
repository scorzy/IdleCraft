import { ActiveAbilityData } from '../../activeAbilities/ActiveAbilityData'
import { CastCharAbilityAdapter } from '../../activeAbilities/abilityAdapters'
import { GameState } from '../../game/GameState'
import { TimerAdapter } from '../../timers/Timer'
import { myMemoizeOne } from '../../utils/myMemoizeOne'
import { CharacterAdapter } from '../characterAdapter'
import { CharacterState } from '../characterState'
import { InitialState } from '@/entityAdapter/InitialState'

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

const selectCharactersTeamIdsInt = myMemoizeOne(
    (characters: InitialState<CharacterState>) =>
        CharacterAdapter.findMany(characters, (c) => !c.isEnemy)?.map((c) => c.id) ?? []
)
export const selectCharactersTeamIds = (state: GameState) => selectCharactersTeamIdsInt(state.characters)
export const selectDeadDialog = (state: GameState) => state.ui.deadDialog
