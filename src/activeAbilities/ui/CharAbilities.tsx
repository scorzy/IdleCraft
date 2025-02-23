import { memo, useCallback } from 'react'
import { useGameStore } from '../../game/state'
import { useTranslations } from '../../msg/useTranslations'
import { CollapsedEnum } from '../../ui/sidebar/CollapsedEnum'
import { SidebarContainer } from '../../ui/sidebar/SidebarContainer'
import { selectSelectedCharId } from '../../ui/state/uiSelectors'
import { selectAllCombatAbilities } from '../selectors/selectAllCombatAbilities'
import { MyListItem } from '../../ui/sidebar/MenuItem'
import { GameState } from '../../game/GameState'
import { IconsData } from '../../icons/Icons'
import { ActiveAbilityData } from '../ActiveAbilityData'
import { selectCombatAbilityById } from '../selectors/selectCombatAbilityById'
import { setAbilityUi } from '../functions/setAbilityUi'
import { isAbilityUiSelected } from '../selectors/isAbilityUiSelected'
import { selectAbilityUi } from '../selectors/selectAbilityUi'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'

export const AbilitySidebar = memo(function AbilitySidebar() {
    const allCombatAbilities = useGameStore(selectAllCombatAbilities)

    return (
        <SidebarContainer collapsedId={CollapsedEnum.AbilityList}>
            {allCombatAbilities.map((t) => (
                <AbilityLink key={t} id={t} />
            ))}
        </SidebarContainer>
    )
})
const AbilityLink = memo(function AbilityLink(props: { id: string }) {
    const { id } = props
    const { t } = useTranslations()
    const characterId = useGameStore(selectSelectedCharId)
    const charAbility = useGameStore(selectCombatAbilityById(id))
    const ability = ActiveAbilityData.getEx(charAbility.abilityId)
    const iconId = useGameStore((state: GameState) => ability.getIconId({ state, characterId }))
    const selected = useGameStore(isAbilityUiSelected(id))
    const onClick = useCallback(() => setAbilityUi(id), [id])

    return (
        <MyListItem
            collapsedId={CollapsedEnum.AbilityList}
            active={selected}
            text={t[ability.nameId]}
            icon={IconsData[iconId]}
            onClick={onClick}
        />
    )
})
export const AbilityUi = memo(function AbilityUi() {
    const { t } = useTranslations()
    const id = useGameStore(selectAbilityUi)
    const characterId = useGameStore(selectSelectedCharId)
    const charAbility = useGameStore(selectCombatAbilityById(id))
    const ability = ActiveAbilityData.getEx(charAbility.abilityId)
    const iconId = useGameStore((state: GameState) => ability.getIconId({ state, characterId }))
    const desc = useGameStore((state: GameState) => ability.getDesc({ state, characterId }))

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {IconsData[iconId]} {t[ability.nameId]}
                </CardTitle>
            </CardHeader>
            <CardContent>{desc}</CardContent>
        </Card>
    )
})
