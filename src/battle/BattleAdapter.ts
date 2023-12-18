import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'
import { BattleState } from './BattleTypes'

class BattleAdapterInt extends AbstractEntityAdapter<BattleState> {
    getId = (data: BattleState) => data.activityId
}
export const BattleAdapter = new BattleAdapterInt()
