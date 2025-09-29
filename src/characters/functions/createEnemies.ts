import { GameState } from '../../game/GameState'
import { CharacterAdapter } from '../characterAdapter'
import { CharTemplatesData } from '../templates/charTemplateData'
import { CharTemplateEnum } from '../templates/characterTemplateEnum'
import { generateCharacter } from '../templates/generateCharacter'
import { resetHealth } from './resetHealth'
import { resetMana } from './resetMana'
import { resetStamina } from './resetStamina'

export function createEnemies(
    state: GameState,
    enemies: {
        quantity: number
        template: CharTemplateEnum
    }[]
): void {
    enemies.forEach((enemyData) => {
        for (let i = 0; i < enemyData.quantity; i++) {
            const enemy = generateCharacter(CharTemplatesData[enemyData.template])
            enemy.isEnemy = true
            CharacterAdapter.create(state.characters, enemy)
        }
    })

    const ids = CharacterAdapter.getIds(state.characters)
    ids.forEach((id) => {
        const char = CharacterAdapter.selectEx(state.characters, id)
        if (!char.isEnemy) return
        resetHealth(state, id)
        resetMana(state, id)
        resetStamina(state, id)
    })
}
