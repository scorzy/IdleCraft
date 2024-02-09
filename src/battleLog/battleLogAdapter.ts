import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'
import { BattleLog } from './battleLogInterfaces'

class BattleLogAdapterInt extends AbstractEntityAdapter<BattleLog> {
    getId = (data: BattleLog) => data.id
}
export const BattleLogAdapter = new BattleLogAdapterInt()
