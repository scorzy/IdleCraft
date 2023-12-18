import { AbstractActivityCreator } from '../activities/AbstractActivityCreator'
import { ActivityTypes } from '../activities/ActivityState'
import { BattleAdapter } from './BattleAdapter'
import { BattleAddType } from './BattleTypes'

export class BattleActivityCreator extends AbstractActivityCreator<BattleAddType> {
    protected type = ActivityTypes.Battle
    onAdd() {
        this.state = {
            ...this.state,
            battle: BattleAdapter.create(this.state.battle, {
                activityId: this.id,
                battleZoneEnum: this.data.battleZoneEnum,
            }),
        }
    }
}
