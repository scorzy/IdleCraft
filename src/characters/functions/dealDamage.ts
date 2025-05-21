import { AbilityLog, AddDamageBattleLog, BattleLogType } from '../../battleLog/battleLogInterfaces'
import { addBattleLog } from '../../battleLog/functions/addBattleLog'
import { GameState } from '../../game/GameState'
import { DamageData, DamageTypes } from '../../items/Item'
import { CharacterAdapter } from '../characterAdapter'
import { getCharacterSelector } from '../getCharacterSelector'
import { getDamageMulti } from './getDamageMulti'
import { kill } from './kill'

export function dealDamage(
    state: GameState,
    targetId: string,
    damageData: DamageData,
    abilityLog: AbilityLog
): { state: GameState; killed: boolean; damageDone: number } {
    let killed = false
    const target = CharacterAdapter.selectEx(state.characters, targetId)
    let damageDone = 0
    Object.entries(damageData).forEach((kv) => {
        if (killed) return

        const damageType: DamageTypes = kv[0] as DamageTypes
        const damage = kv[1]

        const targetSel = getCharacterSelector(targetId)
        const armour = targetSel.armour[damageType].Armour(state)

        const multi = getDamageMulti(damage, armour)
        const damageTaken = damage * multi
        damageDone += damageTaken

        const health = Math.max(0, Math.floor(target.health - damageTaken))

        if (health < 0.0001) killed = true

        state = { ...state, characters: CharacterAdapter.update(state.characters, targetId, { health }) }
    })

    const addLog: AddDamageBattleLog = {
        type: BattleLogType.Damage,
        ...abilityLog,
        damageDone,
    }
    state = addBattleLog(state, addLog)

    if (killed) state = kill(state, targetId)

    return { state, killed, damageDone }
}
