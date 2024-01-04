import { GameState } from '../../game/GameState'
import { getUniqueId } from '../../utils/getUniqueId'
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
): GameState {
    enemies.forEach((enemyData) => {
        const enemy = generateCharacter(CharTemplatesData[enemyData.template])
        enemy.isEnemy = true
        for (let i = 0; i < enemyData.quantity; i++) {
            const enemyToAdd = structuredClone(enemy)
            enemyToAdd.id = getUniqueId()
            state = { ...state, characters: CharacterAdapter.create(state.characters, enemyToAdd) }
        }
    })

    const ids = CharacterAdapter.getIds(state.characters)
    ids.forEach((id) => {
        const char = CharacterAdapter.selectEx(state.characters, id)
        if (!char.isEnemy) return
        state = resetHealth(state, id)
        state = resetMana(state, id)
        state = resetStamina(state, id)
    })

    return state
}
