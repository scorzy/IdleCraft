import { useTranslations } from '../../msg/useTranslations'
import { MyListItem } from '../../ui/MenuItem'
import { WoodTypes } from '../WoodTypes'
import { WoodData } from '../WoodData'
import { useGameStore } from '../../game/state'
import { isWoodSelected } from '../../ui/state/uiSelectors'
import { setWood } from '../../ui/state/uiFunctions'
import List from '@mui/joy/List'

const trees = Object.values(WoodTypes)

export function WoodcuttingSidebar() {
    return (
        <List>
            {trees.map((t) => (
                <TreeLink key={t} woodType={t} />
            ))}
        </List>
    )
}

function TreeLink(props: { woodType: WoodTypes }) {
    const { woodType } = props
    const data = WoodData[woodType]
    const t = useTranslations()
    const selected = useGameStore(isWoodSelected(woodType))

    return <MyListItem text={data.getName(t)} icon={data.icon} active={selected} onClick={() => setWood(woodType)} />
}
