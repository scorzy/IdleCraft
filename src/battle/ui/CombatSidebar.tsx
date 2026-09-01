import { memo, useCallback } from 'react'
import { useGameStore } from '../../game/state'
import { IconsData } from '../../icons/Icons'
import { useTranslations } from '../../msg/useTranslations'
import { CollapsedEnum } from '../../ui/sidebar/CollapsedEnum'
import { CollapsibleMenu, MyListItem } from '../../ui/sidebar/MenuItem'
import { SidebarContainer } from '../../ui/sidebar/SidebarContainer'
import { BattleZoneEnum } from '../BattleZoneEnum'
import { BattleZones } from '../BattleZones'
import { BattleAreas, BattleAreasList } from '../battleAreas'
import { setArea } from '../functions/setArea'
import { isBattleZoneSelected } from '../selectors/isBattleZoneSelected'

export const CombatSidebar = memo(function CombatSidebar() {
    return (
        <SidebarContainer collapsedId={CollapsedEnum.Combat}>
            {BattleAreasList.map((area) => (
                <BattleAreasListUi area={area} key={area.nameId} />
            ))}
        </SidebarContainer>
    )
})

const BattleAreasListUi = memo(function BattleAreasListUi({ area }: { area: BattleAreas }) {
    return (
        <CollapsibleMenu
            collapsedId={area.collapsedId}
            name={area.nameId}
            parentCollapsedId={CollapsedEnum.Combat}
            icon={IconsData[area.iconId]}
        >
            {area.zones.map((zone) => (
                <EnemyLink battleZoneEnum={zone} key={zone} />
            ))}
        </CollapsibleMenu>
    )
})

const EnemyLink = memo(function EnemyLink({ battleZoneEnum }: { battleZoneEnum: BattleZoneEnum }) {
    const { t } = useTranslations()
    const set = useCallback(() => setArea(battleZoneEnum), [battleZoneEnum])
    const active = useGameStore(isBattleZoneSelected(battleZoneEnum))
    const battleZone = BattleZones[battleZoneEnum]

    return (
        <MyListItem
            collapsedId={CollapsedEnum.Combat}
            active={active}
            text={t[battleZone.nameId]}
            icon={IconsData[battleZone.iconId]}
            onClick={set}
        />
    )
})
