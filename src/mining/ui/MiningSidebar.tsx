import { memo } from 'react'
import { useTranslations } from '../../msg/useTranslations'
import { useGameStore } from '../../game/state'
import { setOre } from '../../ui/state/uiFunctions'
import { MyListItem } from '../../ui/sidebar/MenuItem'
import { OreTypes } from '../OreTypes'
import { OreData } from '../OreData'
import { isOreSelected } from '../miningSelectors'
import { SidebarContainer } from '../../ui/sidebar/SidebarContainer'
import { IconsData } from '../../icons/Icons'
import { CollapsedEnum } from '../../ui/sidebar/CollapsedEnum'
import { isCollapsed } from '../../ui/state/uiSelectors'

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
    const data = OreData[oreType]
    const { t } = useTranslations()
    const selected = useGameStore(isOreSelected(oreType))

    return (
        <MyListItem
            text={t[data.nameId]}
            collapsed={collapsed}
            icon={IconsData[data.iconId]}
            active={selected}
            onClick={() => setOre(oreType)}
        />
    )
})
