import { GameState } from '../../game/GameState'
import { AbilitiesEnum } from '../abilitiesEnum'

export const selectAbilityUi = (state: GameState) =>
    state.characters.entries[state.ui.selectedCharId]?.selectedAbilityId ?? AbilitiesEnum.NormalAttack
