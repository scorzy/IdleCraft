import { GameState } from '../../game/GameState'
import { arraySample } from '../../utils/arraySample'
import { CharacterAdapter } from '../characterAdapter'

export function selectRandomEnemy(state: GameState, enemyTeam: boolean) {
    const toSelect: string[] = []
    CharacterAdapter.forEach(state.characters, (c) => {
        if (c.isEnemy === enemyTeam) toSelect.push(c.id)
    })
    return arraySample(toSelect)
}
