import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'
import { Woodcutting } from './Woodcutting'

class WoodcuttingAdapterInt extends AbstractEntityAdapter<Woodcutting> {
    getId(data: Woodcutting): string {
        return data.activityId
    }
}
export const WoodcuttingAdapter = new WoodcuttingAdapterInt()
