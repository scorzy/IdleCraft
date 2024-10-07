import { GameState } from '../game/GameState'
import { PLAYER_ID } from '../characters/charactersConst'
import { CharacterAdapter } from '../characters/characterAdapter'
import { EXP_BASE_PRICE, EXP_GROW_RATE } from './expConst'
import { ExpEnum } from './expEnum'
import { getCharLevel } from './expSelectors'

export function addExp(state: GameState, expType: ExpEnum, expQta: number, characterId: string = PLAYER_ID) {
    if (characterId !== PLAYER_ID) return state

    const char = CharacterAdapter.selectEx(state.characters, characterId)

    const currentExp = char.skillsExp[expType] ?? 0
    const currentLevel = char.skillsLevel[expType] ?? 0

    const skillExp = Math.floor(currentExp + expQta)
    const skillLevel = Math.floor(
        Math.log10((skillExp * (EXP_GROW_RATE - 1)) / EXP_BASE_PRICE + 1) / Math.log10(EXP_GROW_RATE)
    )

    const newLevels = Math.max(Math.floor(skillLevel - currentLevel), 0)
    const exp = char.exp + newLevels
    const level = getCharLevel(exp)

    state = {
        ...state,
        characters: CharacterAdapter.update(state.characters, characterId, {
            exp,
            level,
            skillsExp: { ...char.skillsExp, [expType]: skillExp },
            ...(skillLevel !== currentLevel && {
                skillsLevel: { ...char.skillsLevel, [expType]: skillLevel },
            }),
        }),
    }
    return state
}
