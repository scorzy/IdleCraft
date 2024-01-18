import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { PerksEnum } from '../perks/perksEnum'
import { AbilitiesEnum } from './abilitiesEnum'

export interface CharAbility {
    id: string
    abilityId: AbilitiesEnum
    perkSource?: PerksEnum
    slotSource?: EquipSlotsEnum
}
export interface CastCharAbility {
    id: string
    abilityId: AbilitiesEnum
    characterId: string
}
