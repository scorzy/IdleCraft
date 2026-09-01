import { Fragment, useCallback } from 'react'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { IconsData } from '../../icons/Icons'
import { Msg } from '../../msg/Msg'
import { useTranslations } from '../../msg/useTranslations'
import { selectGameItem } from '../../storage/StorageSelectors'
import { DamageTypesData } from '../damageTypes'
import { DamageTypes, ItemFilter } from '../Item'
import { useItemName } from '../selectors/useItemName'

export function ItemFilterDescription({ itemFilter }: { itemFilter: ItemFilter }) {
    const { f } = useNumberFormatter()
    const { t, fun } = useTranslations()

    if (itemFilter.descriptionId) return t[itemFilter.descriptionId]

    if (itemFilter.itemId !== undefined) return <ItemFilterUiItemId itemId={itemFilter.itemId} />

    let pre: React.ReactElement
    const arr: React.ReactElement[] = []

    if (itemFilter.itemType !== undefined) pre = <>{t[itemFilter.itemType as keyof Msg]}</>
    else pre = <>{t.items}</>

    if (itemFilter.equipmentSlot !== undefined) arr.push(<>{t[itemFilter.equipmentSlot as keyof Msg]}</>)
    if (itemFilter.armourType !== undefined) arr.push(<>{t[itemFilter.armourType as keyof Msg]}</>)
    if (itemFilter.weaponType !== undefined) arr.push(<>{t[itemFilter.weaponType as keyof Msg]}</>)
    if (itemFilter.toolType !== undefined) arr.push(<>{t[itemFilter.toolType as keyof Msg]}</>)
    if (itemFilter.craftingTypes !== undefined)
        arr.push(...itemFilter.craftingTypes.map((craftingType) => <>{t[craftingType as keyof Msg]}</>))

    if (itemFilter.equipSlot !== undefined) arr.push(<>{t[itemFilter.equipSlot as keyof Msg]}</>)
    if (itemFilter?.minStats?.value !== undefined)
        arr.push(
            <>
                {t.Value.toLowerCase()} {' >= '} {f(itemFilter.minStats.value)}
            </>
        )
    if (itemFilter.weaponData?.attackSpeed !== undefined)
        arr.push(
            <>
                {t.AttackSpeed.toLowerCase()}
                {' >= '}
                {fun.formatTime(itemFilter.weaponData.attackSpeed)}
            </>
        )
    if (itemFilter.weaponData?.damage !== undefined) {
        arr.push(
            ...Object.entries(itemFilter.weaponData.damage)
                .toSorted(([a], [b]) => a.localeCompare(b))
                .map((kv) => (
                    <span key={kv[0]}>
                        {t[DamageTypesData[kv[0] as DamageTypes].DamageName].toLowerCase()} {f(kv[1])}
                    </span>
                ))
        )
    }
    if (itemFilter.armourData !== undefined) {
        arr.push(
            ...Object.entries(itemFilter.armourData)
                .toSorted(([a], [b]) => a.localeCompare(b))
                .map((kv) => (
                    <span key={kv[0]}>
                        {t[DamageTypesData[kv[0] as DamageTypes].DamageName].toLowerCase()} {f(kv[1])}
                    </span>
                ))
        )
    }

    if (arr.length === 1)
        pre = (
            <>
                {pre} {t.with1}
            </>
        )
    else if (arr.length > 1)
        pre = (
            <>
                {pre} {t.withProps}
            </>
        )

    return (
        <>
            {' '}
            {pre}{' '}
            {arr.map((el, i) => (
                // eslint-disable-next-line @eslint-react/no-array-index-key
                <Fragment key={i}>
                    {el}
                    {i < arr.length - 1 && ' , '}
                </Fragment>
            ))}
        </>
    )
}

function ItemFilterUiItemId(props: { itemId: string }) {
    const { itemId } = props

    const item = useGameStore(useCallback((s: GameState) => selectGameItem(itemId)(s), [itemId]))
    const itemName = useItemName(item)

    if (!item) return

    return (
        <span>
            {IconsData[item.icon]} {itemName}
        </span>
    )
}
