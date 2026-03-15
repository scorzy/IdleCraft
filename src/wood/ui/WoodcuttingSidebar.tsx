import { memo, useCallback } from 'react'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { GameIcon } from '../../icons/GameIcon'
import { useTranslations } from '../../msg/useTranslations'
import { CollapsedEnum } from '../../ui/sidebar/CollapsedEnum'
import { MyListItem } from '../../ui/sidebar/MenuItem'
import { SidebarContainer } from '../../ui/sidebar/SidebarContainer'
import { lockedIcon, setWood } from '../../ui/state/uiFunctions'
import { isWoodSelected } from '../../ui/state/uiSelectors'
import { isWoodEnabled } from '../selectors/WoodcuttingSelectors'
import { WoodData } from '../WoodData'
import { WoodTypes } from '../WoodTypes'

const trees = Object.values(WoodTypes)

export const WoodcuttingSidebar = memo(function WoodcuttingSidebar() {
    return (
        <SidebarContainer collapsedId={CollapsedEnum.Woodcutting}>
            {trees.map((t) => (
                <TreeLink key={t} woodType={t} />
            ))}
        </SidebarContainer>
    )
})

export const TreeLink = memo(function TreeLink(props: { woodType: WoodTypes }) {
    const { woodType } = props
    const data = WoodData[woodType]
    const { t } = useTranslations()

    const isWoodSelectedMemo = useCallback((state: GameState) => isWoodSelected(woodType)(state), [woodType])
    const isWoodEnabledMemo = useCallback((state: GameState) => isWoodEnabled(woodType)(state), [woodType])

    const selected = useGameStore(isWoodSelectedMemo)
    const enabled = useGameStore(isWoodEnabledMemo)

    const onClick = useCallback(() => setWood(woodType), [woodType])

    const icon = <GameIcon icon={data.iconId} className={data.color} />

    return (
        <MyListItem
            text={t[data.nameId]}
            icon={lockedIcon(icon, enabled)}
            active={selected}
            onClick={onClick}
            enabled={enabled}
            collapsedId={CollapsedEnum.Woodcutting}
        />
    )
})
