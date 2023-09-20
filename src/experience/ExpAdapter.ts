import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'
import { ExpState } from './ExpState'
class ExpAdapterInt extends AbstractEntityAdapter<ExpState> {
    getId = (data: ExpState) => data.id
}
export const ExpAdapter = new ExpAdapterInt()
