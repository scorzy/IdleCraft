import { memo } from 'react'
import { DamageData, CraftingData, Item, PickaxeData, WeaponData, WoodAxeData, DamageTypes } from '../Item'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { useTranslations } from '../../msg/useTranslations'
import { DamageTypesData } from '../damageTypes'
import { Msg } from '../../msg/Msg'

export const ItemInfo = memo(function ItemInfo(props: { item: Item }) {
    const { item } = props
    const { f } = useNumberFormatter()
    const { t } = useTranslations()

    return (
        <div>
            <div>
                {t.ItemType} {t[item.type as keyof Msg]}
            </div>
            <div>
                {t.Value} {f(item.value)}
            </div>
            {item.weaponData && <WeaponDataUi weaponData={item.weaponData} />}
            {item.armourData && <ArmourDataUi armourData={item.armourData} />}
            {item.craftingData && <CraftingDataUi craftingData={item.craftingData} />}
            {item.woodAxeData && <WoodAxeDataUi woodAxeData={item.woodAxeData} />}
            {item.pickaxeData && <PickaxeDataUi pickaxeData={item.pickaxeData} />}
        </div>
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
            <div>
                {t.Damage} {f(woodAxeData.damage)}
            </div>
            <div>
                {t.AttackSpeed} {ft(woodAxeData.time)}
            </div>
        </>
    )
})
export const PickaxeDataUi = memo(function PickaxeDataUi(props: { pickaxeData: PickaxeData }) {
    const { pickaxeData } = props
    const { f, ft } = useNumberFormatter()
    const { t } = useTranslations()

    return (
        <>
            <div>
                {t.Damage} {f(pickaxeData.damage)}
            </div>
            <div>
                {t.AttackSpeed} {ft(pickaxeData.time)}
            </div>
            <div>
                {t.ArmourPen} {f(pickaxeData.armourPen)}
            </div>
        </>
    )
})
export const WeaponDataUi = memo(function WeaponDataUi(props: { weaponData: WeaponData }) {
    const { weaponData } = props
    const { f, ft } = useNumberFormatter()
    const { t } = useTranslations()

    return (
        <>
            <div>
                {t.AttackSpeed} {ft(weaponData.attackSpeed)}
            </div>
            {Object.entries(weaponData.damage).map((kv) => (
                <div key={kv[0]}>
                    {t[DamageTypesData[kv[0] as DamageTypes].DamageName]} {f(kv[1])}
                </div>
            ))}
        </>
    )
})
export const ArmourDataUi = memo(function ArmourDataUi(props: { armourData: DamageData }) {
    const { armourData } = props
    const { f } = useNumberFormatter()
    const { t } = useTranslations()

    return (
        <>
            {Object.entries(armourData).map((kv) => (
                <div key={kv[0]}>
                    {t[DamageTypesData[kv[0] as DamageTypes].DamageName]} {f(kv[1])}
                </div>
            ))}
        </>
    )
})
