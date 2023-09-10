import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'
import { Mining } from './Mining'

class MiningAdapterInt extends AbstractEntityAdapter<Mining> {
    getId(data: Mining): string {
        return data.activityId
    }
}
export const MiningAdapter = new MiningAdapterInt()
