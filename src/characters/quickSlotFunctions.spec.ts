import { describe, expect, it } from 'vitest'
import { consumePotion } from '../alchemy/alchemyFunctions'
import { Effects } from '../effects/types/Effects'
import { GetInitialGameState } from '../game/InitialGameState'
import { Icons } from '../icons/Icons'
import { Item, ItemType } from '../items/Item'
import { ItemAdapter } from '../storage/ItemAdapter'
import { selectGameItem, selectItemQta } from '../storage/StorageSelectors'
import { addItem } from '../storage/storageFunctions'
import { PLAYER_ID } from './charactersConst'
import { EquipSlotsEnum } from './equipSlotsEnum'
import { consumeQuickSlotPotion, equipQuickSlot } from './quickSlotFunctions'
import { selectQuickSlots } from './selectors/quickSlotSelectors'
import { getCharacterDefinition, reconcileCharacterData } from './templates/characterRegistry'
import { generateCharacter } from './templates/generateCharacter'

const healthPotion: Item = {
    id: 'C_health-potion',
    nameId: 'HealthPotion',
    icon: Icons.Potion,
    type: ItemType.Consumable,
    value: 1,
    volume: 1,
    potionData: {
        effects: [{ effect: Effects.Health, value: 15, duration: 0 }],
    },
}

const manaPotion: Item = {
    ...healthPotion,
    id: 'C_mana-potion',
    nameId: 'ManaPotion',
    potionData: {
        effects: [{ effect: Effects.Mana, value: 10, duration: 0 }],
    },
}

const setupState = () => {
    const state = GetInitialGameState()
    ItemAdapter.create(state.craftedItems, healthPotion)
    ItemAdapter.create(state.craftedItems, manaPotion)
    return state
}

describe('quick slots', () => {
    it('initializes one empty quick slot for every generated character', () => {
        reconcileCharacterData()
        const state = GetInitialGameState()
        const generated = generateCharacter('Boar', getCharacterDefinition('Boar'))

        expect(selectQuickSlots(PLAYER_ID)(state)).toEqual([null])
        const generatedState = {
            ...state,
            characters: {
                ...state.characters,
                ids: [...state.characters.ids, generated.id],
                entries: { ...state.characters.entries, [generated.id]: generated },
            },
        }
        expect(selectQuickSlots(generated.id)(generatedState)).toEqual([null])
    })

    it('moves the selected potion quantity into a quick slot and returns replaced stacks', () => {
        const state = setupState()
        addItem(state, healthPotion.id, 5)
        addItem(state, manaPotion.id, 4)

        equipQuickSlot(state, PLAYER_ID, 0, healthPotion.id, 3)
        expect(state.characters.entries[PLAYER_ID]?.inventory[EquipSlotsEnum.QuickSlot]).toEqual({
            itemId: healthPotion.id,
            quantity: 3,
        })
        expect(selectItemQta(null, healthPotion.id)(state)).toBe(2)

        equipQuickSlot(state, PLAYER_ID, 0, manaPotion.id, 2)
        expect(state.characters.entries[PLAYER_ID]?.inventory[EquipSlotsEnum.QuickSlot]).toEqual({
            itemId: manaPotion.id,
            quantity: 2,
        })
        expect(selectItemQta(null, healthPotion.id)(state)).toBe(5)
        expect(selectItemQta(null, manaPotion.id)(state)).toBe(2)

        equipQuickSlot(state, PLAYER_ID, 0, null)
        expect(state.characters.entries[PLAYER_ID]?.inventory[EquipSlotsEnum.QuickSlot]).toBeUndefined()
        expect(selectItemQta(null, manaPotion.id)(state)).toBe(4)
    })

    it('rejects invalid quick slot equipment without changing inventory', () => {
        const state = setupState()
        addItem(state, healthPotion.id, 2)
        const flask: Item = {
            id: 'C_flask',
            nameId: 'GlassFlask',
            icon: Icons.RoundPotion,
            type: ItemType.Consumable,
            value: 1,
            volume: 1,
            flaskData: { reusePercent: 0 },
        }
        ItemAdapter.create(state.craftedItems, flask)
        addItem(state, flask.id, 1)

        equipQuickSlot(state, PLAYER_ID, 0, 'OakLog', 1)
        equipQuickSlot(state, PLAYER_ID, 0, flask.id, 1)
        equipQuickSlot(state, PLAYER_ID, 0, healthPotion.id, 3)
        equipQuickSlot(state, PLAYER_ID, 1, healthPotion.id, 1)

        expect(state.characters.entries[PLAYER_ID]?.inventory[EquipSlotsEnum.QuickSlot]).toBeUndefined()
        expect(selectItemQta(null, healthPotion.id)(state)).toBe(2)
        expect(selectItemQta(null, flask.id)(state)).toBe(1)
    })

    it('keeps an equipped crafted potion available after its storage stack reaches zero', () => {
        const state = setupState()
        addItem(state, healthPotion.id, 1)

        equipQuickSlot(state, PLAYER_ID, 0, healthPotion.id, 1)

        expect(selectItemQta(null, healthPotion.id)(state)).toBe(0)
        expect(selectGameItem(healthPotion.id)(state)).toEqual(healthPotion)
        expect(state.characters.entries[PLAYER_ID]?.inventory[EquipSlotsEnum.QuickSlot]).toEqual({
            itemId: healthPotion.id,
            quantity: 1,
        })
    })

    it('consumes one quick slot potion, applies its effects, and clears an empty slot', () => {
        const state = setupState()
        const player = state.characters.entries[PLAYER_ID]!
        player.health = 20
        player.inventory[EquipSlotsEnum.QuickSlot] = { itemId: healthPotion.id, quantity: 2 }

        consumeQuickSlotPotion(state, PLAYER_ID, 0)
        expect(player.health).toBe(35)
        expect(player.inventory[EquipSlotsEnum.QuickSlot]).toEqual({ itemId: healthPotion.id, quantity: 1 })

        consumeQuickSlotPotion(state, PLAYER_ID, 0)
        expect(player.health).toBe(50)
        expect(player.inventory[EquipSlotsEnum.QuickSlot]).toBeUndefined()
        expect(selectGameItem(healthPotion.id)(state)).toBeUndefined()

        consumeQuickSlotPotion(state, PLAYER_ID, 0)
        expect(player.health).toBe(50)
    })

    it('keeps storage potion consumption unchanged', () => {
        const state = setupState()
        const player = state.characters.entries[PLAYER_ID]!
        player.health = 20
        addItem(state, healthPotion.id, 2)

        consumePotion(state, PLAYER_ID, healthPotion.id)

        expect(player.health).toBe(35)
        expect(selectItemQta(null, healthPotion.id)(state)).toBe(1)
        expect(player.inventory[EquipSlotsEnum.QuickSlot]).toBeUndefined()
    })
})
