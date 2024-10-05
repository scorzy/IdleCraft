import { GameState } from '../game/GameState'
import { Icons } from '../icons/Icons'

export type CharacterSelector = {
    Name(state: GameState): string
    Icon(state: GameState): Icons
    Level(state: GameState): number
    Exp(state: GameState): number
    LevelExp(state: GameState): number
    NextLevelExp(state: GameState): number
    MaxAttributes(state: GameState): number
    UsedAttributes(state: GameState): number
    HealthPoints(state: GameState): number
    StaminaPoint(state: GameState): number
    ManaPoints(state: GameState): number
    Health(state: GameState): number
    Stamina(state: GameState): number
    Mana(state: GameState): number
    MaxHealth(state: GameState): number
    MaxMana(state: GameState): number
    MaxStamina(state: GameState): number
}
