import { useGameStore } from '../../game/state'
import { IconsData } from '../../icons/Icons'
import { useTranslations } from '../../msg/useTranslations'
import { getSelectedItem, getSelectedItemQta } from '../../storage/StorageSelectors'
import { MyCard } from '../../ui/myCard/myCard'
export function SelectedItem() {
    const qta = useGameStore(getSelectedItemQta)
    const item = useGameStore(getSelectedItem)
    const { t } = useTranslations()

    if (qta <= 0) return <></>
    if (item === undefined) return

    return <MyCard title={t[item.nameId]} icon={IconsData[item.icon]}></MyCard>
}
