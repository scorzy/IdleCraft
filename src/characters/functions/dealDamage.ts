import { AbilityLog, AddDamageBattleLog, BattleLogType } from '../../battleLog/battleLogInterfaces'
import { addBattleLog } from '../../battleLog/functions/addBattleLog'
import { ArmourSkillData } from '../../experience/ArmourSkills'
import { addExp } from '../../experience/expFunctions'
import { GameState } from '../../game/GameState'
import { DamageData, DamageTypes, ItemType } from '../../items/Item'
import { CharacterAdapter } from '../characterAdapter'
import { getCharacterSelector } from '../getCharacterSelector'
import { getDamageMulti } from './getDamageMulti'
import { kill } from './kill'

export function dealDamage(
    state: GameState,
    targetId: string,
    damageData: DamageData,
    abilityLog: AbilityLog
): { killed: boolean; damageDone: number } {
    let killed = false
    const target = CharacterAdapter.selectEx(state.characters, targetId)
    const targetSel = getCharacterSelector(targetId)
    const initialHealth = target.health
    let damageDone = 0
    Object.entries(damageData).forEach((kv) => {
        if (killed) return

        const damageType: DamageTypes = kv[0] as DamageTypes
        const damage = kv[1]

        const armour = targetSel.armour[damageType].Armour(state)

        const multi = getDamageMulti(damage, armour)
        const damageTaken = damage * multi
        damageDone += damageTaken

        let health = Math.max(0, Math.floor(target.health - damageTaken))

        if (health < 0.0001) {
            killed = true
            health = 0
        }

        target.health = health
    })

    const healthDamageTaken = initialHealth - target.health
    if (healthDamageTaken > 0)
        Object.values(targetSel.AllCharInventory(state)).forEach((item) => {
            if (!item || item.type !== ItemType.Armour) return
            const skillData = ArmourSkillData[item.armourType]
            addExp(state, skillData.expType, healthDamageTaken * skillData.expPerDamage, targetId)
        })

    const addLog: AddDamageBattleLog = {
        type: BattleLogType.Damage,
        ...abilityLog,
        damageDone,
    }
    addBattleLog(state, addLog)

    if (killed) kill(state, targetId)

    return { killed, damageDone }
}
