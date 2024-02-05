import { memo } from 'react'
import { ArmourData, CraftingData, Item, PickaxeData, WeaponData, WoodAxeData } from '../Item'
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
            {item.weaponData && <WeaponDataUi weaponData={item.weaponData} />}
            {item.armourData && <ArmourDataUi armourData={item.armourData} />}
            {item.craftingData && <CraftingDataUi craftingData={item.craftingData} />}
            {item.woodAxeData && <WoodAxeDataUi woodAxeData={item.woodAxeData} />}
            {item.pickaxeData && <PickaxeDataUi pickaxeData={item.pickaxeData} />}
        </ul>
    )
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
                {t.ArmourPen} {f(pickaxeData.armourPen)}
            </li>
        </>
    )
})
export const WeaponDataUi = memo(function WeaponDataUi(props: { weaponData: WeaponData }) {
    const { weaponData } = props
    const { f, ft } = useNumberFormatter()
    const { t } = useTranslations()

    return (
        <>
            <li>
                {t.Damage} {f(weaponData.damage)}
            </li>
            <li>
                {t.AttackSpeed} {ft(weaponData.attackSpeed)}
            </li>
            <li>Damage Type {weaponData.damageType}</li>
        </>
    )
})
export const ArmourDataUi = memo(function ArmourDataUi(props: { armourData: ArmourData }) {
    const { armourData } = props
    const { f } = useNumberFormatter()
    const { t } = useTranslations()

    return (
        <>
            <li>
                {t.BludgeoningArmour} {f(armourData.Bludgeoning)}
            </li>
            <li>
                {t.PiercingArmour} {f(armourData.Piercing)}
            </li>
            <li>
                {t.SlashingArmour} {f(armourData.Slashing)}
            </li>
        </>
    )
})
