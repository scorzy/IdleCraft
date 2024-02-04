import { Msg } from '../msg/Msg'
import { DamageTypes } from './Item'

export interface DamageTypeData {
    DamageName: keyof Msg
    ArmourName: keyof Msg
}

export const DamageTypesData: { [k in DamageTypes]: DamageTypeData } = {
    [DamageTypes.Bludgeoning]: {
        ArmourName: 'BludgeoningArmour',
        DamageName: 'BludgeoningDamage',
    },
    [DamageTypes.Piercing]: {
        ArmourName: 'PiercingArmour',
        DamageName: 'PiercingDamage',
    },
    [DamageTypes.Slashing]: {
        ArmourName: 'SlashingArmour',
        DamageName: 'SlashingDamage',
    },
}
