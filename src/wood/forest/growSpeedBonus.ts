import { AbstractEntityAdapter } from '../../entityAdapter/entityAdapter'
import { GameLocations } from '../../gameLocations/GameLocations'
import { WoodTypes } from '../WoodTypes'

export interface GrowSpeedBonus {
    id: string
    location: GameLocations
    woodType: WoodTypes
    multi: number
}

class GrowSpeedBonusAdapterInt extends AbstractEntityAdapter<GrowSpeedBonus> {
    getId(data: GrowSpeedBonus): string {
        return data.id
    }
}

export const GrowSpeedBonusAdapter = new GrowSpeedBonusAdapterInt()
