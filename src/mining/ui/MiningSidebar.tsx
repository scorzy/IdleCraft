import { memo, useCallback } from 'react'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { ItemIcon } from '../../items/ui/ItemIcon'
import { useItemName } from '../../items/useItemName'
import { CollapsedEnum } from '../../ui/sidebar/CollapsedEnum'
import { MyListItem } from '../../ui/sidebar/MenuItem'
import { SidebarContainer } from '../../ui/sidebar/SidebarContainer'
import { lockedIcon, setOre } from '../../ui/state/uiFunctions'
import { isOreEnabled, isOreSelected } from '../miningSelectors'
import { OreData } from '../OreData'
import { OreTypes } from '../OreTypes'

const ores = Object.values(OreTypes)

export const MiningSidebar = memo(function MiningSidebar() {
    return (
        <SidebarContainer collapsedId={CollapsedEnum.Mining}>
            {ores.map((t) => (
                <MiningLink key={t} oreType={t} />
            ))}
        </SidebarContainer>
    )
})

const MiningLink = memo(function MiningLink(props: { oreType: OreTypes }) {
    const { oreType } = props

    const isSelected = useCallback((state: GameState) => isOreSelected(oreType)(state), [oreType])
    const isEnabled = useCallback((state: GameState) => isOreEnabled(oreType)(state), [oreType])
    const onClick = useCallback(() => setOre(oreType), [oreType])
    const selected = useGameStore(isSelected)
    const enabled = useGameStore(isEnabled)

    const data = OreData[oreType]

    const text = useItemName(data.oreId)
    const icon = <ItemIcon itemId={data.oreId} />
    return (
        <MyListItem
            text={text}
            collapsedId={CollapsedEnum.Mining}
            icon={lockedIcon(icon, enabled)}
            active={selected}
            onClick={onClick}
        />
    )
})
