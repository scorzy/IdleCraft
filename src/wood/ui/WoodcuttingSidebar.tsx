import { useTranslations } from '../../msg/useTranslations'
import { WoodTypes } from '../WoodTypes'
import { WoodData } from '../WoodData'
import { useGameStore } from '../../game/state'
import { isCollapsed, isWoodSelected } from '../../ui/state/uiSelectors'
import { setWood } from '../../ui/state/uiFunctions'
import { MyListItem } from '../../ui/sidebar/MenuItem'
import { SidebarContainer } from '../../ui/sidebar/SidebarContainer'

const trees = Object.values(WoodTypes)

export function WoodcuttingSidebar() {
    const collapsed = useGameStore(isCollapsed('wood'))
    return (
        <SidebarContainer id="wood">
            {trees.map((t) => (
                <TreeLink key={t} woodType={t} collapsed={collapsed} />
            ))}
        </SidebarContainer>
    )
}

function TreeLink(props: { woodType: WoodTypes; collapsed: boolean }) {
    const { woodType, collapsed } = props
    const data = WoodData[woodType]
    const { t } = useTranslations()
    const selected = useGameStore(isWoodSelected(woodType))

    return (
        <MyListItem
            text={t[data.nameId]}
            collapsed={collapsed}
            icon={data.icon}
            active={selected}
            onClick={() => setWood(woodType)}
        />
    )
}
