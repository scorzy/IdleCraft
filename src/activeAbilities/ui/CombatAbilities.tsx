import { memo, useCallback } from 'react'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { useGameStore } from '../../game/state'
import { selectCombatAbilities } from '../selectors/selectCombatAbilities'
import { IconsData } from '../../icons/Icons'
import { selectCombatAbility, selectCombatAbilityId } from '../selectors/selectCombatAbility'
import { selectAllCombatAbilities } from '../selectors/selectAllCombatAbilities'
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
import { ComboBoxResponsive, ComboBoxItem } from '../../components/ui/comboBox'
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
                            // eslint-disable-next-line @eslint-react/no-array-index-key
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
                            // eslint-disable-next-line @eslint-react/no-array-index-key
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
    const selectedCharAbility = useGameStore(selectCombatAbility(index))
    const allCombatAbilities = useGameStore(selectAllCombatAbilities)
    const selectedId = useGameStore(selectCombatAbilityId(index))

    const onChange = useCallback((value: string) => changeCombatAbility(index, value), [index])
    const onClick = useCallback(() => removeRotation(index), [index])

    return (
        <div className={classes.abilityRow}>
            <ComboBoxResponsive
                selectedId={selectedCharAbility ?? null}
                triggerContent={selectedId ? <SelectedAbility selectedId={selectedId} /> : undefined}
            >
                {allCombatAbilities.map((r) => (
                    <Ability key={r} id={r} onSelect={onChange} selected={selectedCharAbility === r} />
                ))}
            </ComboBoxResponsive>
            <Button variant="ghost" title={t.Remove} onClick={onClick}>
                {TrashIcon}
            </Button>
        </div>
    )
})

const Ability = memo(function Ability(props: { id: string; onSelect: (value: string) => void; selected: boolean }) {
    const { id, onSelect, selected } = props
    const { t } = useTranslations()
    const charAbility = useGameStore(selectCombatAbilityById(id))
    const ability = ActiveAbilityData.getEx(charAbility.abilityId)
    const iconId = useGameStore((state: GameState) =>
        ability.getIconId({ state, characterId: state.ui.selectedCharId })
    )
    const onClick = useCallback(() => onSelect(id), [id])

    return (
        <ComboBoxItem value={id} icon={IconsData[iconId]} onSelect={onClick} selected={selected}>
            {t[ability.nameId]}
        </ComboBoxItem>
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
