import { memo, useCallback } from 'react'
import { useGameStore } from '../../game/state'
import { GameState } from '../../game/GameState'
import { useTranslations } from '../../msg/useTranslations'
import { setGatheringZone } from '../../ui/state/uiFunctions'
import { CollapsibleMenu, MyListItem } from '../../ui/sidebar/MenuItem'
import { CollapsedEnum } from '../../ui/sidebar/CollapsedEnum'
import { SidebarContainer } from '../../ui/sidebar/SidebarContainer'
import { IconsData } from '../../icons/Icons'
import { GatheringData, GatheringZoneGroups } from '../gatheringData'
import { GatheringZone } from '../gatheringZones'
import { GatheringGroupZone } from '../gatheringTypes'
import { isGatheringZoneUnlocked } from '../selectors/isGatheringZoneUnlocked'

export const GatheringSidebar = memo(function GatheringSidebar() {
    return (
        <SidebarContainer collapsedId={CollapsedEnum.Gathering}>
            {GatheringZoneGroups.map((group) => (
                <GatheringZoneGroupUI key={group.nameId} group={group} />
            ))}
        </SidebarContainer>
    )
})

export const GatheringZoneGroupUI = memo(function GatheringZoneGroupUI({ group }: { group: GatheringGroupZone }) {
    return (
        <CollapsibleMenu
            collapsedId={CollapsedEnum.QuestAccepted}
            name={group.nameId}
            parentCollapsedId={CollapsedEnum.Gathering}
            icon={IconsData[group.iconId]}
        >
            {group.group.map((configId) => (
                <GatheringZoneLink key={configId} zone={configId} />
            ))}
        </CollapsibleMenu>
    )
})

const GatheringZoneLink = memo(function GatheringZoneLink({ zone }: { zone: GatheringZone }) {
    const { t } = useTranslations()
    const isSelected = useCallback((state: GameState) => state.ui.gatheringZone === zone, [zone])
    const unlocked = useGameStore(useCallback((state: GameState) => isGatheringZoneUnlocked(zone)(state), [zone]))
    const onClick = useCallback(() => {
        if (unlocked) setGatheringZone(zone)
    }, [zone, unlocked])

    const selected = useGameStore(isSelected)
    const data = GatheringData[zone]

    return (
        <MyListItem
            text={unlocked ? t[data.nameId] : `${t[data.nameId]} (Locked)`}
            collapsedId={CollapsedEnum.Gathering}
            icon={IconsData.Forest}
            active={selected}
            onClick={onClick}
        />
    )
})
