import { ReactNode } from 'react'
import { AbstractActivity, ActivityStartResult } from '../activities/AbstractActivity'
import { Translations } from '../msg/Msg'
import { createEnemies } from '../characters/functions/createEnemies'
import { CharacterStateAdapter } from '../characters/characterAdapter'
import { execNextAbility } from '../activeAbilities/functions/execNextAbility'
import { BattleStateFull } from './BattleTypes'
import { BattleAdapter } from './BattleAdapter'
import { BattleZones } from './BattleZones'

export class BattleActivity extends AbstractActivity<BattleStateFull> {
    getData(): BattleStateFull {
        const data = BattleAdapter.selectEx(this.state.battle, this.id)
        return {
            ...data,
            battleZone: BattleZones[this.data.battleZoneEnum],
        }
    }
    onStart(): ActivityStartResult {
        this.state = createEnemies(this.state, this.data.battleZone.enemies)
        CharacterStateAdapter.findIds(this.state.characters).forEach((charId) => {
            this.state = execNextAbility(this.state, charId)
        })

        return ActivityStartResult.Started
    }
    onExec(): ActivityStartResult {
        return ActivityStartResult.Ended
    }
    onRemove(): void {
        this.state = { ...this.state, battle: BattleAdapter.remove(this.state.battle, this.id) }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected getTitleInt(_t: Translations): string {
        throw new Error('Method not implemented.')
    }
    getIcon(): ReactNode {
        throw new Error('Method not implemented.')
    }
}
