import { memo, useCallback } from 'react'
import { TbLock } from 'react-icons/tb'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { IconsData } from '../../icons/Icons'
import { CollapsedEnum } from '../../ui/sidebar/CollapsedEnum'
import { CollapsibleMenu, MyListItem } from '../../ui/sidebar/MenuItem'
import { SidebarContainer } from '../../ui/sidebar/SidebarContainer'
import { setGatheringZone } from '../../ui/state/uiFunctions'
import { GatheringSubZoneData, GatheringZoneSubZones } from '../gatheringData'
import { GatheringSubZone, GatheringZone } from '../gatheringZones'
import { isSubZoneUnlocked } from '../zoneProgression'

const zones = Object.values(GatheringZone)

export const GatheringSidebar = memo(function GatheringSidebar() {
    return (
        <SidebarContainer collapsedId={CollapsedEnum.Gathering}>
            {zones.map((zone) => (
                <GatheringZoneMenu key={zone} zone={zone} />
            ))}
        </SidebarContainer>
    )
})

const GatheringZoneMenu = memo(function GatheringZoneMenu({ zone }: { zone: GatheringZone }) {
    return (
        <CollapsibleMenu
            name={zone}
            icon={IconsData.Forest}
            collapsedId={CollapsedEnum.GatheringForest}
            parentCollapsedId={CollapsedEnum.Gathering}
        >
            {GatheringZoneSubZones[zone].map((subZone) => (
                <GatheringSubZoneLink key={subZone} subZone={subZone} />
            ))}
        </CollapsibleMenu>
    )
})

const GatheringSubZoneLink = memo(function GatheringSubZoneLink({ subZone }: { subZone: GatheringSubZone }) {
    const selected = useGameStore((state: GameState) => state.ui.gatheringZone === subZone)
    const unlocked = useGameStore((state: GameState) => isSubZoneUnlocked(state, subZone))
    const onClick = useCallback(() => {
        setGatheringZone(subZone)
    }, [subZone, unlocked])

    return (
        <MyListItem
            text={GatheringSubZoneData[subZone].name}
            collapsedId={CollapsedEnum.Gathering}
            icon={unlocked ? IconsData.Forest : <TbLock />}
            active={selected}
            onClick={onClick}
        />
    )
})
