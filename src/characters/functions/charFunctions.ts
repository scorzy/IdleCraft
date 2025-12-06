import { GameState } from '../../game/GameState'
import { CharacterAdapter } from '../characterAdapter'
import { CharacterState } from '../characterState'
import { getCharacterSelector } from '../getCharacterSelector'

export const addHealth = (state: GameState, charId: string | CharacterState, amount: number): void => {
    const char = typeof charId === 'string' ? CharacterAdapter.selectEx(state.characters, charId) : charId
    const charSel = getCharacterSelector(char.id)
    const maxHealth = charSel.MaxHealth(state)
    char.health = Math.min(char.health + amount, maxHealth)
}
export const addStamina = (state: GameState, charId: string | CharacterState, amount: number): void => {
    const char = typeof charId === 'string' ? CharacterAdapter.selectEx(state.characters, charId) : charId
    const charSel = getCharacterSelector(char.id)
    const maxStamina = charSel.MaxStamina(state)
    char.stamina = Math.min(char.stamina + amount, maxStamina)
}
export const addMana = (state: GameState, charId: string | CharacterState, amount: number): void => {
    const char = typeof charId === 'string' ? CharacterAdapter.selectEx(state.characters, charId) : charId
    const charSel = getCharacterSelector(char.id)
    const maxMana = charSel.MaxMana(state)
    char.mana = Math.min(char.mana + amount, maxMana)
}
