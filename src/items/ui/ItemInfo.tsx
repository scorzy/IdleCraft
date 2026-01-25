import { memo } from 'react'
import { DamageData, CraftingData, Item, PickaxeData, WeaponData, WoodAxeData, DamageTypes } from '../Item'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { useTranslations } from '../../msg/useTranslations'
import { DamageTypesData } from '../damageTypes'
import { Msg } from '../../msg/Msg'
import { IngredientData, IngredientEffect, PotionData } from '../../alchemy/alchemyTypes'
import { alchemyEffectData } from '../../alchemy/alchemyData'
import { isEffectDiscovered } from '../../alchemy/alchemySelectors'
import { useGameStore } from '../../game/state'

export const ItemInfo = memo(function ItemInfo(props: { item: Item }) {
    const { item } = props
    const { f } = useNumberFormatter()
    const { t } = useTranslations()

    return (
        <div>
            <div>
                <span className="text-muted-foreground">{t.ItemType}</span> {t[item.type as keyof Msg]}
            </div>
            <div>
                <span className="text-muted-foreground">{t.Value}</span> {f(item.value)}
            </div>
            {item.weaponData && <WeaponDataUi weaponData={item.weaponData} />}
            {item.armourData && <ArmourDataUi armourData={item.armourData} />}
            {item.craftingData && <CraftingDataUi craftingData={item.craftingData} />}
            {item.woodAxeData && <WoodAxeDataUi woodAxeData={item.woodAxeData} />}
            {item.pickaxeData && <PickaxeDataUi pickaxeData={item.pickaxeData} />}
            {item.potionData && <PotionDataUi potionData={item.potionData} />}
            {item.ingredientData && <IngredientDataUi item={item} ingredientData={item.ingredientData} />}
        </div>
    )
})
export const WeaponDataUi = memo(function WeaponDataUi(props: { weaponData: WeaponData }) {
    const { weaponData } = props
    const { f } = useNumberFormatter()
    const { t, fun } = useTranslations()

    return (
        <>
            <div>
                {t.AttackSpeed} {fun.formatTime(weaponData.attackSpeed)}
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

export const CraftingDataUi = memo(function CraftingDataUi(props: { craftingData: CraftingData }) {
    const { craftingData } = props
    const { f } = useNumberFormatter()
    const { fun } = useTranslations()

    const craftingDataPercent = 100 * (craftingData.prestige - 1)

    return <div>{fun.prestigePercent(f(craftingDataPercent))}</div>
})
export const WoodAxeDataUi = memo(function WoodAxeDataUi(props: { woodAxeData: WoodAxeData }) {
    const { woodAxeData } = props
    const { f } = useNumberFormatter()
    const { t, fun } = useTranslations()

    return (
        <>
            <div>
                {t.Damage} {f(woodAxeData.damage)}
            </div>
            <div>
                {t.AttackSpeed} {fun.formatTime(woodAxeData.time)}
            </div>
        </>
    )
})
export const PickaxeDataUi = memo(function PickaxeDataUi(props: { pickaxeData: PickaxeData }) {
    const { pickaxeData } = props
    const { f } = useNumberFormatter()
    const { t, fun } = useTranslations()

    return (
        <>
            <div>
                {t.Damage} {f(pickaxeData.damage)}
            </div>
            <div>
                {t.AttackSpeed} {fun.formatTime(pickaxeData.time)}
            </div>
            <div>
                {t.ArmourPen} {f(pickaxeData.armourPen)}
            </div>
        </>
    )
})
export const PotionDataUi = memo(function PotionDataUi({ potionData }: { potionData: PotionData }) {
    const { f } = useNumberFormatter()
    const { t, fun } = useTranslations()
    return (
        <>
            {potionData.effects.map((effect) => {
                const data = alchemyEffectData[effect.effect]

                return (
                    <div key={effect.effect}>
                        <span className="text-muted-foreground">{t[data.nameId1]} </span>
                        {f(effect.value)}
                        <span className="text-muted-foreground"> {t[data.nameId2]} </span>
                        {!data.instant && (
                            <>
                                <span className="text-muted-foreground">{t[data.nameId3 ?? 'PerSecFor']}</span>{' '}
                                {fun.formatTime(effect.duration)}
                            </>
                        )}
                    </div>
                )
            })}
        </>
    )
})
export const IngredientDataUi = memo(function IngredientDataUi({
    ingredientData,
    item,
}: {
    ingredientData: IngredientData
    item: Item
}) {
    const { t } = useTranslations()
    return (
        <div>
            <span className="text-muted-foreground">{t.AlchemyIngredient}</span>
            {ingredientData.effects.map((e) => {
                return (
                    <div key={e.effect}>
                        <IngredientDataLineUi item={item} ingredientEffect={e} />
                    </div>
                )
            })}
        </div>
    )
})
export const IngredientDataLineUi = memo(function IngredientDataLineUi({
    ingredientEffect,
    item,
}: {
    ingredientEffect: IngredientEffect
    item: Item
}) {
    const { t } = useTranslations()
    const data = alchemyEffectData[ingredientEffect.effect]
    const isDiscovered = useGameStore((state) => isEffectDiscovered(state, item, ingredientEffect.effect))

    if (!isDiscovered) return <span className="text-muted-foreground">{t.UnknownProperty}</span>

    return (
        <span>
            {ingredientEffect.potency} {t[data.descId]}
        </span>
    )
})
