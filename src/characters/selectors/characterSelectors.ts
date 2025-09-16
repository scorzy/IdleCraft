import { memoize } from 'proxy-memoize'
import { ActiveAbilityData } from '../../activeAbilities/ActiveAbilityData'
import { CastCharAbilityAdapter } from '../../activeAbilities/abilityAdapters'
import { GameState } from '../../game/GameState'
import { TimerAdapter } from '../../timers/Timer'
import { CharacterAdapter } from '../characterAdapter'

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

export const selectCharactersTeamIds = memoize(
    (state: GameState) => CharacterAdapter.findMany(state.characters, (c) => !c.isEnemy)?.map((c) => c.id) ?? []
)
export const selectDeadDialog = (state: GameState) => state.ui.deadDialog
