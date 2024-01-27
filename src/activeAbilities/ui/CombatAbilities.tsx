import { memo, useCallback } from 'react'
import { MyCard } from '../../ui/myCard/MyCard'
import { useGameStore } from '../../game/state'
import { selectCombatAbilities } from '../selectors/selectCombatAbilities'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
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
import classes from './combatAbilities.module.css'

export const CombatAbilities = memo(function CombatAbilities() {
    const { t } = useTranslations()
    const selected = useGameStore(selectCombatAbilities)

    return (
        <MyCard title="Skill Rotation">
            {selected.map((c, index) => (
                <CombatAbility index={index} key={c + index} />
            ))}
            <Button variant="secondary" onClick={addRotation}>
                {t.Add}
            </Button>
        </MyCard>
    )
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
            <Select value={selectedCharAbility} onValueChange={onChange}>
                <SelectTrigger>
                    <SelectValue placeholder={' - '}>
                        {selectedId && <SelectedAbility selectedId={selectedId} />}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {allCombatAbilities.map((r) => (
                        <Ability key={r} id={r} />
                    ))}
                </SelectContent>
            </Select>
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

const Ability = memo(function Ability(props: { id: string }) {
    const { id } = props
    const { t } = useTranslations()
    const charAbility = useGameStore(selectCombatAbilityById(id))
    const ability = ActiveAbilityData.getEx(charAbility.abilityId)
    const iconId = useGameStore((state: GameState) =>
        ability.getIconId({ state, characterId: state.ui.selectedCharId })
    )

    return (
        <SelectItem value={id} icon={IconsData[iconId]}>
            {t[ability.nameId]}
        </SelectItem>
    )
})
