import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'
import { Woodcutting } from './WoodInterfaces'

class WoodcuttingAdapterInt extends AbstractEntityAdapter<Woodcutting> {
    getId(data: Woodcutting): string {
        return data.activityId
    }
}
export const WoodcuttingAdapter = new WoodcuttingAdapterInt()
