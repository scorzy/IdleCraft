import { ArmourType } from '../items/Item'
import { Msg } from '../msg/Msg'
import { ExpEnum } from './ExpEnum'

export const ARMOUR_SKILL_BONUS_PER_LEVEL = 1

export const ArmourSkillData: Record<ArmourType, { expType: ExpEnum; expPerDamage: number; nameId: keyof Msg }> = {
    [ArmourType.Light]: { expType: ExpEnum.LightArmour, expPerDamage: 0.05, nameId: 'LightArmour' },
    [ArmourType.Medium]: { expType: ExpEnum.MediumArmour, expPerDamage: 0.1, nameId: 'MediumArmour' },
    [ArmourType.Heavy]: { expType: ExpEnum.HeavyArmour, expPerDamage: 0.15, nameId: 'HeavyArmour' },
}
