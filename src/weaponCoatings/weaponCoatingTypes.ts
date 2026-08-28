import { Effects } from '../effects/types/Effects'
import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'

export enum WeaponCoatingKind {
    Poison = 'Poison',
}

export const WEAPON_COATING_EFFECTS = [
    Effects.DamageRegenHealth,
    Effects.DamageRegenStamina,
    Effects.DamageRegenMana,
] as const

export const isWeaponCoatingEffect = (effect: Effects): boolean =>
    WEAPON_COATING_EFFECTS.includes(effect as (typeof WEAPON_COATING_EFFECTS)[number])

export interface WeaponCoatingEffect {
    effect: Effects
    value: number
    duration: number
}

export interface WeaponCoatingData {
    kind: WeaponCoatingKind
    charges: number
    effects: WeaponCoatingEffect[]
    nameId: keyof Msg
    iconId: Icons
}

export interface ActiveWeaponCoating {
    weaponItemId: string
    coatingItemId: string
    coatingInstanceId: string
    remainingCharges: number
    data: WeaponCoatingData
}
