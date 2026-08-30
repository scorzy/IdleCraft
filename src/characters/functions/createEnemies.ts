import { GameState } from '../../game/GameState'
import { initCharacterStdItems } from '../../items/stdItems'
import { CharacterAdapter } from '../characterAdapter'
import { CharacterData, CharacterId, reconcileCharacterData } from '../templates/characterRegistry'
import { generateCharacter } from '../templates/generateCharacter'
import { resetHealth } from './resetHealth'
import { resetMana } from './resetMana'
import { resetStamina } from './resetStamina'

export function createEnemies(
    state: GameState,
    enemies: {
        quantity: number
        template: CharacterId
    }[]
): void {
    reconcileCharacterData()
    initCharacterStdItems()
    enemies.forEach((enemyData) => {
        for (let i = 0; i < enemyData.quantity; i++) {
            const enemy = generateCharacter(enemyData.template, CharacterData[enemyData.template])
            enemy.isEnemy = true
            CharacterAdapter.create(state.characters, enemy)
        }
    })

    CharacterAdapter.forEach(state.characters, (char) => {
        if (!char.isEnemy) return
        resetHealth(state, char.id)
        resetMana(state, char.id)
        resetStamina(state, char.id)
    })
}
