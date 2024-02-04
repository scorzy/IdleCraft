import { GameState } from '../../game/GameState'
import { DamageTypes } from '../../items/Item'
import { CharacterAdapter } from '../characterAdapter'
import { selectCharacterArmour } from '../selectors/armourSelector'
import { kill } from './kill'

export function dealDamage(
    state: GameState,
    targetId: string,
    damage: number,
    damageType: DamageTypes
): { state: GameState; killed: boolean } {
    const target = CharacterAdapter.selectEx(state.characters, targetId)
    const armour = selectCharacterArmour(targetId, damageType)(state)
    let killed = false
    let multi = damage / (damage + armour)
    if (armour < 0) multi = Math.min(2, multi)
    const damageTaken = damage * multi

    const health = Math.floor(target.health - damageTaken)
    if (health < 0.0001) {
        state = kill(state, targetId)
        killed = true
    } else {
        state = { ...state, characters: CharacterAdapter.update(state.characters, targetId, { health }) }
    }

    return { state, killed }
}
