import { Msg } from '../msg/Msg'
import { Icons } from '../icons/Icons'
import { AbilitiesEnum } from '../activeAbilities/abilitiesEnum'
import { PerksEnum } from './perksEnum'
import { ExpEnum } from '@/experience/ExpEnum'

export interface ExpReq {
    skill: ExpEnum
    level: number
}
interface Perk {
    id: PerksEnum
    iconId: Icons
    nameId: keyof Msg
    descId: keyof Msg
    requiredExp?: ExpReq[]
    requiredPerks?: PerksEnum[]
    max?: number
    abilityUnlock?: AbilitiesEnum
}
export const PerksData: Record<PerksEnum, Perk> = {
    [PerksEnum.FAST_WOODCUTTING]: {
        id: PerksEnum.FAST_WOODCUTTING,
        iconId: Icons.Axe,
        nameId: 'FastWoodcuttingPerk',
        descId: 'FastWoodcuttingPerkDesc',
    },
    [PerksEnum.FAST_MINING]: {
        id: PerksEnum.FAST_MINING,
        iconId: Icons.Pickaxe,
        nameId: 'FastMiningPerk',
        descId: 'FastMiningPerkDesc',
    },
    [PerksEnum.VEIN_MASTERY]: {
        id: PerksEnum.VEIN_MASTERY,
        iconId: Icons.Ore,
        nameId: 'VeinMasteryPerk',
        descId: 'VeinMasteryPerkDesc',
        requiredPerks: [PerksEnum.FAST_MINING],
        requiredExp: [{ skill: ExpEnum.Mining, level: 8 }],
    },
    [PerksEnum.CHARGED_ATTACK]: {
        id: PerksEnum.CHARGED_ATTACK,
        iconId: Icons.SaberSlash,
        nameId: 'ChargedAttackPerk',
        descId: 'ChargedAttackPerkDesc',
        abilityUnlock: AbilitiesEnum.ChargedAttack,
    },
}
