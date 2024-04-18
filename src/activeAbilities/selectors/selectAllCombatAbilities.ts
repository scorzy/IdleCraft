import { ComboBoxList, ComboBoxValue } from '../../components/ui/comboBox'
import { GameState } from '../../game/GameState'
import { selectTranslations } from '../../msg/useTranslations'
import { ActiveAbilityData } from '../ActiveAbilityData'
import { selectCombatAbilityById } from './selectCombatAbilityById'

export const selectAllCombatAbilities = (state: GameState) =>
    state.characters.entries[state.ui.selectedCharId]?.allCombatAbilities.ids ?? []

export const getActivityCombo: (state: GameState, activityId: string) => ComboBoxValue = (
    state: GameState,
    value: string
) => {
    const t = selectTranslations(state)
    const charAbility = selectCombatAbilityById(value)(state)
    const ability = ActiveAbilityData.getEx(charAbility.abilityId)
    const iconId = ability.getIconId({ state, characterId: state.ui.selectedCharId })

    return {
        label: t.t[ability.nameId],
        value,
        iconId,
    }
}

export const selectAllCombatAbilitiesCombo = (state: GameState) => {
    const items = selectAllCombatAbilities(state)
    const values: ComboBoxList[] = [
        {
            title: '',
            list: items.map((v) => getActivityCombo(state, v)),
        },
    ]
    return values
}
