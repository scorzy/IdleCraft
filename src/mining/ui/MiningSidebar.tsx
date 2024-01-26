import { memo, useCallback } from 'react'
import { useTranslations } from '../../msg/useTranslations'
import { useGameStore } from '../../game/state'
import { lockedIcon, setOre } from '../../ui/state/uiFunctions'
import { MyListItem } from '../../ui/sidebar/MenuItem'
import { OreTypes } from '../OreTypes'
import { OreData } from '../OreData'
import { isOreEnabled, isOreSelected } from '../miningSelectors'
import { SidebarContainer } from '../../ui/sidebar/SidebarContainer'
import { IconsData } from '../../icons/Icons'
import { CollapsedEnum } from '../../ui/sidebar/CollapsedEnum'
import { isCollapsed } from '../../ui/state/uiSelectors'
import { GameState } from '../../game/GameState'

const ores = Object.values(OreTypes)

export const MiningSidebar = memo(function MiningSidebar() {
    const collapsed = useGameStore(isCollapsed(CollapsedEnum.Mining))
    return (
        <SidebarContainer collapsedId={CollapsedEnum.Mining}>
            {ores.map((t) => (
                <MiningLink key={t} oreType={t} collapsed={collapsed} />
            ))}
        </SidebarContainer>
    )
})

const MiningLink = memo(function MiningLink(props: { oreType: OreTypes; collapsed: boolean }) {
    const { oreType, collapsed } = props
    const { t } = useTranslations()

    const isSelected = useCallback((state: GameState) => isOreSelected(oreType)(state), [oreType])
    const isEnabled = useCallback((state: GameState) => isOreEnabled(oreType)(state), [oreType])
    const onClick = useCallback(() => setOre(oreType), [oreType])
    const selected = useGameStore(isSelected)
    const enabled = useGameStore(isEnabled)

    const data = OreData[oreType]

    return (
        <MyListItem
            text={t[data.nameId]}
            collapsed={collapsed}
            icon={lockedIcon(IconsData[data.iconId], enabled)}
            active={selected}
            onClick={onClick}
        />
    )
})
