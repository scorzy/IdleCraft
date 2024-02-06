import { memo } from 'react'
import { EquipSlotsEnum } from '../equipSlotsEnum'
import { EquipItemUi } from '../../items/ui/EquipSelect'

const equipments = Object.keys(EquipSlotsEnum)
export const CharEquipments = memo(function CharEquipments() {
    return (
        <>
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
