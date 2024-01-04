import { useTranslations } from '../../msg/useTranslations'
import { WoodTypes } from '../WoodTypes'
import { WoodData } from '../WoodData'
import { useGameStore } from '../../game/state'
import { isWoodSelected } from '../../ui/state/uiSelectors'
import { setWood } from '../../ui/state/uiFunctions'
import { MyListItem } from '../../ui/sidebar/MenuItem'

const trees = Object.values(WoodTypes)

export function WoodcuttingSidebar() {
    return (
        <>
            {trees.map((t) => (
                <TreeLink key={t} woodType={t} collapsed={false} />
            ))}
        </>
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
            icon={data.iconId}
            active={selected}
            onClick={() => setWood(woodType)}
        />
    )
}
