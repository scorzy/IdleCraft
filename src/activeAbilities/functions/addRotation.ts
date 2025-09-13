import { CharacterAdapter } from '../../characters/characterAdapter'
import { setState } from '../../game/state'
import { AbilitiesEnum } from '../abilitiesEnum'

export const addRotation = () =>
    setState((state) => {
        const charId = state.ui.selectedCharId
        const char = CharacterAdapter.selectEx(state.characters, charId)
        char.combatAbilities.push(AbilitiesEnum.NormalAttack)
    })
