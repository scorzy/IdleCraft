import { memoize } from 'proxy-memoize'
import { GameState } from '../game/GameState'
import { getCharLevelExp } from '../experience/expSelectors'
import { selectTranslations } from '../msg/useTranslations'
import { CharacterAdapter } from './characterAdapter'
import { CharacterSelector } from './CharacterSelector'
import { selectMaxHealthFromChar } from './selectors/healthSelectors'
import { selectMaxManaFromChar } from './selectors/manaSelectors'
import { selectMaxStaminaFromChar } from './selectors/staminaSelectors'

export const makeCharacterSelector: (charId: string) => CharacterSelector = (charId: string) => {
    const selChar = memoize((s: GameState) => CharacterAdapter.selectEx(s.characters, charId))

    const Name = memoize((state: GameState) => {
        const char = CharacterAdapter.selectEx(state.characters, charId)
        if (char.name) return char.name
        const t = selectTranslations(state)
        const nameId = char.nameId
        if (!nameId) throw new Error('name not found')
        return t.t[nameId]
    })

    const Icon = memoize((state: GameState) => CharacterAdapter.selectEx(state.characters, charId).iconId)

    const Level = memoize((s: GameState) => selChar(s).level)
    const Exp = memoize((s: GameState) => selChar(s).exp)
    const LevelExp = memoize((s: GameState) => getCharLevelExp(selChar(s).level))
    const NextLevelExp = memoize((s: GameState) => getCharLevelExp(selChar(s).level + 1))
    const MaxAttributes = memoize((s: GameState) => Level(s))
    const UsedAttributes = memoize((s: GameState) => {
        const char = selChar(s)
        return Math.floor(char.healthPoints + char.staminaPoints + char.manaPoints)
    })
    const HealthPoints = memoize((s: GameState) => selChar(s).healthPoints)
    const StaminaPoint = memoize((s: GameState) => selChar(s).staminaPoints)
    const ManaPoints = memoize((s: GameState) => selChar(s).manaPoints)
    const Health = memoize((s: GameState) => selChar(s).health)
    const Stamina = memoize((s: GameState) => selChar(s).stamina)
    const Mana = memoize((s: GameState) => selChar(s).mana)

    const MaxHealthList = memoize((s: GameState) => selectMaxHealthFromChar(selChar(s)))
    const MaxManaList = memoize((s: GameState) => selectMaxManaFromChar(selChar(s)))
    const MaxStaminaList = memoize((s: GameState) => selectMaxStaminaFromChar(selChar(s)))

    const MaxHealth = memoize((state: GameState) => MaxHealthList(state).total)
    const MaxMana = memoize((state: GameState) => MaxManaList(state).total)
    const MaxStamina = memoize((state: GameState) => MaxStaminaList(state).total)

    return {
        Name,
        Icon,
        Level,
        Exp,
        LevelExp,
        NextLevelExp,
        MaxAttributes,
        UsedAttributes,
        HealthPoints,
        StaminaPoint,
        ManaPoints,
        Health,
        Stamina,
        Mana,
        MaxHealth,
        MaxMana,
        MaxStamina,
        MaxHealthList,
        MaxManaList,
        MaxStaminaList,
    }
}
