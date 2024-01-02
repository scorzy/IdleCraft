import { ReactNode } from 'react'
import { GiCrossedSwords } from 'react-icons/gi'
import { AbstractActivity, ActivityStartResult } from '../activities/AbstractActivity'
import { Translations } from '../msg/Msg'
import { createEnemies } from '../characters/functions/createEnemies'
import { CharacterStateAdapter } from '../characters/characterAdapter'
import { startNextAbility } from '../activeAbilities/functions/startNextAbility'
import { BattleStateFull } from './BattleTypes'
import { BattleAdapter } from './BattleAdapter'
import { BattleZones } from './BattleZones'

export class BattleActivity extends AbstractActivity<BattleStateFull> {
    getData(): BattleStateFull {
        const data = BattleAdapter.selectEx(this.state.battle, this.id)
        return {
            ...data,
            battleZone: BattleZones[data.battleZoneEnum],
        }
    }
    onStart(): ActivityStartResult {
        this.state = createEnemies(this.state, this.data.battleZone.enemies)
        CharacterStateAdapter.findIds(this.state.characters).forEach((charId) => {
            this.state = startNextAbility(this.state, charId)
        })

        return ActivityStartResult.Started
    }
    onExec(): ActivityStartResult {
        return ActivityStartResult.Ended
    }
    onRemove(): void {
        this.state = { ...this.state, battle: BattleAdapter.remove(this.state.battle, this.id) }
    }

    protected getTitleInt(t: Translations): string {
        return t.fun.fighting(this.data.battleZone.nameId)
    }
    getIcon(): ReactNode {
        return <GiCrossedSwords />
    }
}
