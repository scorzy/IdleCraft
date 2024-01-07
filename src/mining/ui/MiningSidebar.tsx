import { memo, useState } from 'react'
import { useTranslations } from '../../msg/useTranslations'
import { useGameStore } from '../../game/state'
import { setOre } from '../../ui/state/uiFunctions'
import { MyListItem } from '../../ui/sidebar/MenuItem'
import { OreTypes } from '../OreTypes'
import { OreData } from '../OreData'
import { isOreSelected } from '../miningSelectors'
import { SidebarContainer } from '../../ui/sidebar/SidebarContainer'
import { IconsData } from '../../icons/Icons'

const ores = Object.values(OreTypes)

export const MiningSidebar = memo(function MiningSidebar() {
    const [collapsed, setCollapsed] = useState(false)
    return (
        <SidebarContainer collapsed={collapsed} collapseClick={() => setCollapsed((c) => !c)}>
            {ores.map((t) => (
                <MiningLink key={t} oreType={t} collapsed={false} />
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
