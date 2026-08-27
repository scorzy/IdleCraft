import { memo } from 'react'
import { EquipItemUi } from '../../items/ui/EquipSelect'
import { EquipSlotsEnum } from '../equipSlotsEnum'
import { QuickSlots } from './QuickSlots'

const equipments = Object.keys(EquipSlotsEnum).filter((slot) => slot !== EquipSlotsEnum.QuickSlot)
export const CharEquipments = memo(function CharEquipments() {
    return (
        <>
            <QuickSlots />
            {equipments.map((e) => (
                <CharEquipmentSlot key={e} slot={e as EquipSlotsEnum} />
            ))}
        </>
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
