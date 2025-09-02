import { Fragment, useCallback } from 'react'
import { useGameStore } from '../../game/state'
import { useTranslations } from '../../msg/useTranslations'
import { selectGameItem } from '../../storage/StorageSelectors'
import { DamageTypes, ItemFilter } from '../Item'
import { GameState } from '../../game/GameState'
import { IconsData } from '../../icons/Icons'
import { Msg } from '../../msg/Msg'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { DamageTypesData } from '../damageTypes'

export function ItemFilterDescription(props: { itemFilter: ItemFilter }) {
    const { itemFilter } = props
    const { f } = useNumberFormatter()
    const { t, fun } = useTranslations()

    if (itemFilter.itemId !== undefined) return <ItemFilterUiItemId itemId={itemFilter.itemId} />

    let pre: React.ReactElement = <></>
    const arr: React.ReactElement[] = []

    if (itemFilter.itemType !== undefined) pre = <>{t[itemFilter.itemType as keyof Msg]}</>
    else if (itemFilter.itemSubType !== undefined) pre = <>{t[itemFilter.itemSubType as keyof Msg]}</>
    else pre = <>{t.items}</>

    if (itemFilter.itemSubType !== undefined)
        arr.push(
            <>
                {t.ItemType} {t[itemFilter.itemSubType as keyof Msg]}
            </>
        )

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
                .sort()
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
                .sort()
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

    const { t } = useTranslations()
    const item = useGameStore(useCallback((s: GameState) => selectGameItem(itemId)(s), [itemId]))

    if (!item) return

    return (
        <span>
            {IconsData[item.icon]} {t[item.nameId]}
        </span>
    )
}
