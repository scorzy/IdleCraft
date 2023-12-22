import { GameState } from '../../game/GameState'
import { getUniqueId } from '../../utils/getUniqueId'
import { CharacterStateAdapter } from '../characterAdapter'
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
): GameState {
    enemies.forEach((enemyData) => {
        const enemy = generateCharacter(CharTemplatesData[enemyData.template])
        enemy.isEnemy = true
        for (let i = 0; i < enemyData.quantity; i++) {
            const enemyToAdd = structuredClone(enemy)
            const id = getUniqueId()
            enemyToAdd.id = id
            state = { ...state, characters: CharacterStateAdapter.create(state.characters, enemyToAdd) }
            state = resetHealth(state, id)
            state = resetMana(state, id)
            state = resetStamina(state, id)
        }
    })

    return state
}
