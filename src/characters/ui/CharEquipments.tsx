import { memo } from 'react'
import { EquipItemUi } from '../../items/ui/EquipSelect'
import { EquipSlotsEnum } from '../equipSlotsEnum'
import { QuickSlots } from './QuickSlots'
import { selectActiveWeaponCoating } from '../../weaponCoatings/weaponCoatingSelectors'
import { getCharacterSelector } from '../getCharacterSelector'
import { useGameStore } from '../../game/state'
import { Card, CardContent } from '../../components/ui/card'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { IconsData } from '../../icons/Icons'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { useTranslations } from '../../msg/useTranslations'
import { getWeaponCoatingEffectiveness, scaleWeaponCoatingValue } from '../../weaponCoatings/weaponCoatingFunctions'
import { selectSelectedCharId } from '../../ui/state/uiSelectors'

const equipments = Object.keys(EquipSlotsEnum).filter((slot) => slot !== EquipSlotsEnum.QuickSlot)
export const CharEquipments = memo(function CharEquipments() {
    return (
        <>
            <QuickSlots />
            {equipments.map((e) => (
                <CharEquipmentSlot key={e} slot={e as EquipSlotsEnum} />
            ))}
            <ActiveWeaponCoatingUi />
        </>
    )
})

const ActiveWeaponCoatingUi = memo(function ActiveWeaponCoatingUi() {
    const charId = useGameStore(selectSelectedCharId)
    const coating = useGameStore(selectActiveWeaponCoating(charId))
    const weapon = useGameStore(getCharacterSelector(charId).MainWeapon)
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    if (!coating || !weapon) return null

    const effectiveness = getWeaponCoatingEffectiveness(weapon)
    return (
        <Card>
            <MyCardHeaderTitle title={t.ActiveCoating} icon={IconsData[coating.data.iconId]} />
            <CardContent>
                <div>{t[coating.data.nameId]}</div>
                <div>
                    {t.CoatingCharges}: {f(coating.remainingCharges)}
                </div>
                <div>
                    {t.CoatingEffectiveness}: {f(effectiveness / 100)}%
                </div>
                {coating.data.effects.map((effect) => (
                    <div key={effect.effect}>
                        {t.DamagePerSec}: {f(scaleWeaponCoatingValue(effect.value, effectiveness))}
                    </div>
                ))}
            </CardContent>
        </Card>
    )
})
export const CharEquipmentSlot = memo(function CharEquipmentSlot(props: { slot: EquipSlotsEnum }) {
    const { slot } = props

    return (
        <div>
            <EquipItemUi slot={slot} />
        </div>
    )
})
