import { CharacterAdapter } from '../characters/characterAdapter'
import { PLAYER_CHAR, PLAYER_ID } from '../characters/charactersConst'
import { CharacterState } from '../characters/characterState'
import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { Inventory } from '../characters/inventory'
import { ActivityTypes } from '../activities/ActivityState'
import { GameLocationAdapter } from '../gameLocations/GameLocationAdapter'
import { deepMerge } from '../utils/deepMerge'
import { GameState } from './GameState'
import { GetInitialGameState } from './InitialGameState'

type LegacyCharacterState = CharacterState & { quickSlots?: unknown }

const isInventory = (value: unknown): value is Inventory => {
    if (!value || typeof value !== 'object' || !('itemId' in value) || typeof value.itemId !== 'string') return false
    const inventory = value as { itemId: string; quantity?: unknown }
    return (
        inventory.quantity === undefined ||
        (typeof inventory.quantity === 'number' && Number.isSafeInteger(inventory.quantity) && inventory.quantity >= 1)
    )
}

const normalizeCharacterInventories = (state: GameState) => {
    CharacterAdapter.forEach(state.characters, (character) => {
        const legacyCharacter = character as LegacyCharacterState
        if (
            !legacyCharacter.inventory ||
            typeof legacyCharacter.inventory !== 'object' ||
            Array.isArray(legacyCharacter.inventory)
        )
            legacyCharacter.inventory = {}

        const legacyQuickSlot = Array.isArray(legacyCharacter.quickSlots) ? legacyCharacter.quickSlots[0] : undefined
        if (!legacyCharacter.inventory[EquipSlotsEnum.QuickSlot] && isInventory(legacyQuickSlot))
            legacyCharacter.inventory[EquipSlotsEnum.QuickSlot] = legacyQuickSlot

        Reflect.deleteProperty(legacyCharacter, 'quickSlots')
    })
}

const removeLegacyCraftingResults = (state: GameState) => {
    Reflect.deleteProperty(state.craftingForm, 'result')
    for (const activity of Object.values(state.activities.entries)) {
        if (activity?.type === ActivityTypes.Crafting) Reflect.deleteProperty(activity, 'result')
    }
}

export function loadData(data: object): GameState {
    const initial = GetInitialGameState()
    initial.characters = CharacterAdapter.getInitialState()
    const saveData = { ...data } as Partial<GameState> & { caravanSlots?: unknown; locations?: unknown }
    const legacyCaravanSlots = saveData.caravanSlots
    delete saveData.caravanSlots
    if ('locations' in saveData) saveData.locations = GameLocationAdapter.load(saveData.locations)
    const state = deepMerge(initial, saveData as Partial<GameState>)
    if (typeof legacyCaravanSlots === 'number')
        GameLocationAdapter.selectEx(state.locations, state.location).caravanSlots = legacyCaravanSlots
    if (!CharacterAdapter.select(state.characters, PLAYER_ID)) CharacterAdapter.create(state.characters, PLAYER_CHAR)
    normalizeCharacterInventories(state)
    removeLegacyCraftingResults(state)

    return state
}
