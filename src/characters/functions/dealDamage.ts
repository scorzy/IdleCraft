import { GameState } from '../../game/GameState'
import { DamageData, DamageTypes } from '../../items/Item'
import { CharacterAdapter } from '../characterAdapter'
import { getCharacterSelector } from '../getCharacterSelector'
import { getDamageMulti } from './getDamageMulti'
import { kill } from './kill'

export function dealDamage(
    state: GameState,
    targetId: string,
    damageData: DamageData
): { state: GameState; killed: boolean } {
    let killed = false
    const target = CharacterAdapter.selectEx(state.characters, targetId)
    Object.entries(damageData).forEach((kv) => {
        if (killed) return

        const damageType: DamageTypes = kv[0] as DamageTypes
        const damage = kv[1]

        const targetSel = getCharacterSelector(targetId)
        const armour = targetSel.armour[damageType].Armour(state)

        const multi = getDamageMulti(damage, armour)
        const damageTaken = damage * multi

        const health = Math.max(0, Math.floor(target.health - damageTaken))
        if (health < 0.0001) {
            state = kill(state, targetId)
            killed = true
        } else {
            state = { ...state, characters: CharacterAdapter.update(state.characters, targetId, { health }) }
        }
    })
    return { state, killed }
}
