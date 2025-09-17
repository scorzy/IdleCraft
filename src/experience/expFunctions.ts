import { GameState } from '../game/GameState'
import { PLAYER_ID } from '../characters/charactersConst'
import { CharacterAdapter } from '../characters/characterAdapter'
import { EXP_BASE_PRICE, EXP_GROW_RATE } from './expConst'
import { ExpEnum } from './ExpEnum'
import { getCharLevel } from './expSelectors'

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

    char.exp += expQta
    char.level = getCharLevel(char.exp)
    char.skillsExp[expType] = skillExp
    if (skillLevel !== currentLevel) char.skillsLevel[expType] = skillLevel
}
