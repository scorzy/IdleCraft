import { memo, useCallback } from 'react'
import { useTranslations } from '../../msg/useTranslations'
import { WoodTypes } from '../WoodTypes'
import { WoodData } from '../WoodData'
import { useGameStore } from '../../game/state'
import { isCollapsed, isWoodSelected } from '../../ui/state/uiSelectors'
import { lockedIcon, setWood } from '../../ui/state/uiFunctions'
import { MyListItem } from '../../ui/sidebar/MenuItem'
import { SidebarContainer } from '../../ui/sidebar/SidebarContainer'
import { IconsData } from '../../icons/Icons'
import { CollapsedEnum } from '../../ui/sidebar/CollapsedEnum'
import { isWoodEnabled } from '../selectors/WoodcuttingSelectors'
import { GameState } from '../../game/GameState'

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

    const isWoodSelectedMemo = useCallback((state: GameState) => isWoodSelected(woodType)(state), [woodType])
    const isWoodEnabledMemo = useCallback((state: GameState) => isWoodEnabled(woodType)(state), [woodType])

    const selected = useGameStore(isWoodSelectedMemo)
    const enabled = useGameStore(isWoodEnabledMemo)

    const onClick = useCallback(() => setWood(woodType), [woodType])

    return (
        <MyListItem
            text={t[data.nameId]}
            collapsed={collapsed}
            icon={lockedIcon(IconsData[data.iconId], enabled)}
            active={selected}
            onClick={onClick}
            enabled={enabled}
        />
    )
})
