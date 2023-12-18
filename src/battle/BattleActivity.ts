import { ReactNode } from 'react'
import { AbstractActivity, ActivityStartResult } from '../activities/AbstractActivity'
import { Translations } from '../msg/Msg'
import { generateCharacter } from '../characters/templates/generateCharacter'
import { CharTemplatesData } from '../characters/templates/charTemplateData'
import { CharacterState } from '../characters/characterState'
import { getUniqueId } from '../utils/getUniqueId'
import { BattleStateFull } from './BattleTypes'
import { BattleAdapter } from './BattleAdapter'
import { BattleZones } from './BattleZones'
import { execCharNextAction } from './functions/execCharNextAction'

// eslint-disable-next-line import/no-unused-modules
export class BattleActivity extends AbstractActivity<BattleStateFull> {
    getData(): BattleStateFull {
        const data = BattleAdapter.selectEx(this.state.battle, this.id)
        return {
            ...data,
            battleZone: BattleZones[this.data.battleZoneEnum],
        }
    }
    onStart(): ActivityStartResult {
        const enemyToAdd: Record<string, CharacterState> = {}
        for (const enemyData of this.data.battleZone.enemies) {
            const enemy = generateCharacter(CharTemplatesData[enemyData.template])
            enemy.enemy = true
            for (let i = 0; i < enemyData.quantity; i++) enemyToAdd[getUniqueId()] = structuredClone(enemy)
        }
        this.state = { ...this.state, characters: { ...this.state.characters, ...enemyToAdd } }
        return ActivityStartResult.Started
    }
    onExec(): ActivityStartResult {
        Object.keys(this.state.characters).forEach((charId: string) => {
            this.state = execCharNextAction(this.state, charId)
        })
        return ActivityStartResult.Started
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
