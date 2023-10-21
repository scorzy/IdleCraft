import { memo } from 'react'
import { CraftingData, HandleData, Item, PickaxeData, WoodAxeData } from '../Item'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { useTranslations } from '../../msg/useTranslations'

export const ItemInfo = memo(function ItemInfo(props: { item: Item }) {
    const { item } = props
    const { f } = useNumberFormatter()
    const { t } = useTranslations()

    return (
        <ul>
            <li>
                {t.ItemType} {item.type}
            </li>
            <li>
                {t.Value} {f(item.value)}
            </li>
            {item.craftingData && <CraftingDataUi craftingData={item.craftingData} />}
            {item.handleData && <HandleDataUi handleData={item.handleData} />}
            {item.woodAxeData && <WoodAxeDataUi woodAxeData={item.woodAxeData} />}
            {item.pickaxeData && <PickaxeDataUi pickaxeData={item.pickaxeData} />}
        </ul>
    )
})
export const HandleDataUi = memo(function HandleDataUi(props: { handleData: HandleData }) {
    const { handleData } = props
    const { f } = useNumberFormatter()
    const { fun } = useTranslations()

    const speedBonusPercent = 100 * (handleData.speedBonus - 1)

    return <li>{fun.speedBonusPercent(f(speedBonusPercent))}</li>
})
export const CraftingDataUi = memo(function CraftingDataUi(props: { craftingData: CraftingData }) {
    const { craftingData } = props
    const { f } = useNumberFormatter()
    const { fun } = useTranslations()

    const craftingDataPercent = 100 * (craftingData.prestige - 1)

    return <li>{fun.prestigePercent(f(craftingDataPercent))}</li>
})
export const WoodAxeDataUi = memo(function WoodAxeDataUi(props: { woodAxeData: WoodAxeData }) {
    const { woodAxeData } = props
    const { f, ft } = useNumberFormatter()
    const { t } = useTranslations()

    return (
        <>
            <li>
                {t.Damage} {f(woodAxeData.damage)}
            </li>
            <li>
                {t.AttackSpeed} {ft(woodAxeData.time)}
            </li>
        </>
    )
})
export const PickaxeDataUi = memo(function PickaxeDataUi(props: { pickaxeData: PickaxeData }) {
    const { pickaxeData } = props
    const { f, ft } = useNumberFormatter()
    const { t } = useTranslations()

    return (
        <>
            <li>
                {t.Damage} {f(pickaxeData.damage)}
            </li>
            <li>
                {t.AttackSpeed} {ft(pickaxeData.time)}
            </li>
            <li>
                {t.ArmourPen} {ft(pickaxeData.armourPen)}
            </li>
        </>
    )
})
