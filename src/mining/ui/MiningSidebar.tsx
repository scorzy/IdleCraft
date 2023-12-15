import { useTranslations } from '../../msg/useTranslations'
import { useGameStore } from '../../game/state'
import { setOre } from '../../ui/state/uiFunctions'
import { MyListItem } from '../../ui/sidebar/MenuItem'
import { OreTypes } from '../OreTypes'
import { OreData } from '../OreData'
import { isOreSelected } from '../miningSelectors'
import { MyCard } from '../../ui/myCard/myCard'

const ores = Object.values(OreTypes)

export function MiningSidebar() {
    return (
        <MyCard title="Ores">
            {ores.map((t) => (
                <MiningLink key={t} oreType={t} collapsed={false} />
            ))}
        </MyCard>
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
