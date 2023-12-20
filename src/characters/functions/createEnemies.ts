import { GameState } from '../../game/GameState'
import { getUniqueId } from '../../utils/getUniqueId'
import { CharacterState } from '../characterState'
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
    const enemyToAdd: Record<string, CharacterState> = {}
    const ids: string[] = []
    enemies.forEach((enemyData) => {
        const enemy = generateCharacter(CharTemplatesData[enemyData.template])
        enemy.isEnemy = true
        for (let i = 0; i < enemyData.quantity; i++) {
            const id = getUniqueId()
            ids.push(id)
            enemyToAdd[id] = structuredClone(enemy)
        }
    })
    state = { ...state, characters: { ...state.characters, ...enemyToAdd } }

    ids.forEach((charId) => {
        state = resetHealth(state, charId)
        state = resetMana(state, charId)
        state = resetStamina(state, charId)
    })

    return state
}
