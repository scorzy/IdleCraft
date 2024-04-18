import { memo, useCallback } from 'react'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { useGameStore } from '../../game/state'
import { selectCombatAbilities } from '../selectors/selectCombatAbilities'
import { IconsData } from '../../icons/Icons'
import { selectCombatAbilityId } from '../selectors/selectCombatAbility'
import { selectAllCombatAbilitiesCombo } from '../selectors/selectAllCombatAbilities'
import { selectCombatAbilityById } from '../selectors/selectCombatAbilityById'
import { ActiveAbilityData } from '../ActiveAbilityData'
import { useTranslations } from '../../msg/useTranslations'
import { GameState } from '../../game/GameState'
import { changeCombatAbility } from '../functions/changeCombatAbility'
import { Button } from '../../components/ui/button'
import { addRotation } from '../functions/addRotation'
import { removeRotation } from '../functions/removeRotation'
import { TrashIcon } from '../../icons/IconsMemo'
import { Card, CardContent } from '../../components/ui/card'
import { isCharReadonly } from '../../ui/state/uiSelectors'
import { ComboBoxResponsive, ComboBoxValue } from '../../components/ui/comboBox'
import classes from './combatAbilities.module.css'

export const CombatAbilities = memo(function CombatAbilities() {
    const { t } = useTranslations()
    const selected = useGameStore(selectCombatAbilities)
    const readonly = useGameStore(isCharReadonly)

    return (
        <Card title="Skill Rotation">
            <MyCardHeaderTitle title="Skill Rotation" />
            <CardContent>
                {!readonly && (
                    <>
                        {selected.map((c, index) => (
                            <CombatAbility index={index} key={c + index} />
                        ))}
                        <Button variant="secondary" onClick={addRotation}>
                            {t.Add}
                        </Button>
                    </>
                )}
                {readonly && (
                    <>
                        {selected.map((c, index) => (
                            <CombatAbilitiesReadOnly index={index} key={c + index} />
                        ))}
                    </>
                )}
            </CardContent>
        </Card>
    )
})

export const CombatAbilitiesReadOnly = memo(function CombatAbilitiesReadOnly(props: { index: number }) {
    const { index } = props
    const selectedId = useGameStore(selectCombatAbilityId(index))
    if (!selectedId) return

    return <SelectedAbility selectedId={selectedId} />
})

const CombatAbility = memo(function CombatAbility(props: { index: number }) {
    const { index } = props
    const { t } = useTranslations()

    const selectedId = useGameStore(selectCombatAbilityId(index))
    const onClick = useCallback(() => removeRotation(index), [index])

    const values = useGameStore(selectAllCombatAbilitiesCombo)
    const onChangeCombo = useCallback(
        (value: ComboBoxValue | null) => changeCombatAbility(index, value?.value ?? ''),
        [index]
    )
    const selectedCombo = values[0]?.list.find((v) => v.value === selectedId) || null

    return (
        <div className={classes.abilityRow}>
            <ComboBoxResponsive values={values} selectedValues={selectedCombo} setSelectedValue={onChangeCombo} />

            <Button variant="ghost" title={t.Remove} onClick={onClick}>
                {TrashIcon}
            </Button>
        </div>
    )
})

const SelectedAbility = memo(function SelectedAbility(props: { selectedId: string }) {
    const { selectedId } = props
    const { t } = useTranslations()
    const charAbility = useGameStore(selectCombatAbilityById(selectedId))
    const ability = ActiveAbilityData.getEx(charAbility.abilityId)
    const iconId = useGameStore((state: GameState) =>
        ability.getIconId({ state, characterId: state.ui.selectedCharId })
    )

    return (
        <span className="select-trigger">
            {IconsData[iconId]} {t[ability.nameId]}
        </span>
    )
})
