import { CharacterAdapter } from '../characters/characterAdapter'
import { PLAYER_ID } from '../characters/charactersConst'
import { GameState } from '../game/GameState'
import { ExpEnum } from './ExpEnum'
import { EXP_BASE_PRICE, EXP_GROW_RATE } from './expConst'
import { getCharLevel } from './expSelectors'
import { onPlayerLevelUpListeners, onPlayerSkillUpListeners } from './levelUpListeners'

export function addExp(state: GameState, expType: ExpEnum, expQta: number, characterId: string = PLAYER_ID): void {
    const char = CharacterAdapter.selectEx(state.characters, characterId)
    if (char.isEnemy) return

    const currentExp = char.skillsExp[expType] ?? 0
    const currentLevel = char.skillsLevel[expType] ?? -1

    const skillExp = Math.floor(currentExp + expQta)
    const skillLevel =
        skillExp < EXP_BASE_PRICE
            ? 0
            : Math.floor(Math.log10((skillExp * (EXP_GROW_RATE - 1)) / EXP_BASE_PRICE + 1) / Math.log10(EXP_GROW_RATE))

    if (char.id === PLAYER_ID && skillLevel > currentLevel)
        onPlayerSkillUpListeners.forEach((listener) => listener(state, expType, currentLevel, skillLevel))

    char.exp += expQta
    const prevLevel = char.level
    char.level = getCharLevel(char.exp)
    char.skillsExp[expType] = skillExp
    if (skillLevel !== currentLevel) char.skillsLevel[expType] = skillLevel

    if (char.id === PLAYER_ID && char.level > prevLevel)
        onPlayerLevelUpListeners.forEach((listener) => listener(state, prevLevel, char.level))
}
