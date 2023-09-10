import { useTranslations } from '../../msg/useTranslations'
import { useGameStore } from '../../game/state'
import { isCollapsed, setOre } from '../../ui/state/uiFunctions'
import { MyListItem } from '../../ui/sidebar/MenuItem'
import { SidebarContainer } from '../../ui/sidebar/SidebarContainer'
import { OreTypes } from '../OreTypes'
import { OreData } from '../OreData'
import { isOreSelected } from '../miningSelectors'

const ores = Object.values(OreTypes)

export function MiningSidebar() {
    const collapsed = useGameStore(isCollapsed('ore'))
    return (
        <SidebarContainer id="wood">
            {ores.map((t) => (
                <MiningLink key={t} oreType={t} collapsed={collapsed} />
            ))}
        </SidebarContainer>
    )
}

function MiningLink(props: { oreType: OreTypes; collapsed: boolean }) {
    const { oreType, collapsed } = props
    const data = OreData[oreType]
    const { t } = useTranslations()
    const selected = useGameStore(isOreSelected(oreType))

    return (
        <MyListItem
            text={t[data.nameId]}
            collapsed={collapsed}
            icon={data.icon}
            active={selected}
            onClick={() => setOre(oreType)}
        />
    )
}
