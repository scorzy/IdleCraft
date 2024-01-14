import { memo } from 'react'
import { useTranslations } from '../../msg/useTranslations'
import { WoodTypes } from '../WoodTypes'
import { WoodData } from '../WoodData'
import { useGameStore } from '../../game/state'
import { isCollapsed, isWoodSelected } from '../../ui/state/uiSelectors'
import { setWood } from '../../ui/state/uiFunctions'
import { MyListItem } from '../../ui/sidebar/MenuItem'
import { SidebarContainer } from '../../ui/sidebar/SidebarContainer'
import { IconsData } from '../../icons/Icons'
import { CollapsedEnum } from '../../ui/sidebar/CollapsedEnum'

const trees = Object.values(WoodTypes)

export const WoodcuttingSidebar = memo(function WoodcuttingSidebar() {
    const collapsed = useGameStore(isCollapsed(CollapsedEnum.Woodcutting))
    return (
        <SidebarContainer collapsedId={CollapsedEnum.Woodcutting}>
            {trees.map((t) => (
                <TreeLink key={t} woodType={t} collapsed={collapsed} />
            ))}
        </SidebarContainer>
    )
})

export const TreeLink = memo(function TreeLink(props: { woodType: WoodTypes; collapsed: boolean }) {
    const { woodType, collapsed } = props
    const data = WoodData[woodType]
    const { t } = useTranslations()
    const selected = useGameStore(isWoodSelected(woodType))

    return (
        <MyListItem
            text={t[data.nameId]}
            collapsed={collapsed}
            icon={IconsData[data.iconId]}
            active={selected}
            onClick={() => setWood(woodType)}
        />
    )
})
