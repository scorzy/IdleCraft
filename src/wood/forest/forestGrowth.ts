import { AbstractEntityAdapter } from '../../entityAdapter/entityAdapter'
import { GameLocations } from '../../gameLocations/GameLocations'
import { WoodTypes } from '../WoodTypes'

export interface TreeGrowth {
    id: string
    location: GameLocations
    woodType: WoodTypes
}
class TreeGrowthAdapterInt extends AbstractEntityAdapter<TreeGrowth> {
    getId(data: TreeGrowth): string {
        return data.id
    }
}
export const TreeGrowthAdapter = new TreeGrowthAdapterInt()
