import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { ActivityAdapter, ActivityTypes } from '../../activities/ActivityState'
import { initialize } from '../../game/functions/initialize'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { Icons } from '../../icons/Icons'
import { ItemType, CraftingType } from '../../items/Item'
import { addItem } from '../../storage/storageFunctions'
import { Timer } from '../../timers/Timer'
import { ExpEnum } from '../../experience/ExpEnum'
import { Crafting } from '../CraftingIterfaces'
import { Recipe } from '../Recipe'
import { RecipeTypes } from '../RecipeInterfaces'
import { recipes } from '../Recipes'
import { execCrafting } from './execCrafting'

describe('execCrafting', () => {
    let state: GameState
    const timer: Timer = { id: 'timer', from: 0, to: 0, type: ActivityTypes.Crafting, actId: 'crafting' }

    beforeAll(() => initialize())

    beforeEach(() => {
        state = GetInitialGameState()
    })

    function addCrafting(
        recipeId: string,
        paramsValue: { id: string; itemId: string }[] = [],
        autoBuy?: Record<string, boolean>
    ) {
        const activity: Crafting = {
            id: 'crafting',
            type: ActivityTypes.Crafting,
            recipeId,
            paramsValue,
            max: 1,
            remove: false,
            autoBuy,
        }
        ActivityAdapter.create(state.activities, activity)
    }

    it('throws when the activity is missing or has the wrong type', () => {
        expect(() => execCrafting(state, timer)).toThrow()

        ActivityAdapter.create(state.activities, {
            id: 'crafting',
            type: ActivityTypes.Gathering,
            max: 1,
        })
        expect(() => execCrafting(state, timer)).toThrow()
    })

    it('removes the activity when the recipe cannot produce a result', () => {
        addCrafting('PlankRecipe')

        execCrafting(state, timer)

        expect(ActivityAdapter.select(state.activities, 'crafting')).toBeUndefined()
        expect(state.activityDone).toBe(0)
    })

    it('does not consume inputs when requirements are unavailable', () => {
        addCrafting('PlankRecipe', [{ id: 'log', itemId: 'OakLog' }])

        execCrafting(state, timer)

        expect(state.locations.entries[state.location]!.storage.entries.OakLog).toBeUndefined()
        expect(ActivityAdapter.select(state.activities, 'crafting')).toBeUndefined()
    })

    it('consumes inputs, creates standard outputs, grants recipe XP, and ends the activity', () => {
        addCrafting('PlankRecipe', [{ id: 'log', itemId: 'OakLog' }])
        addItem(state, 'OakLog', 2)

        execCrafting(state, timer)

        const storage = state.locations.entries[state.location]!.storage
        expect(storage.entries.OakLog?.quantity).toBe(1)
        expect(storage.entries.OakPlank?.quantity).toBe(1)
        expect(state.characters.entries.Player!.skillsExp[ExpEnum.Woodworking]).toBe(10)
        expect(state.activityDone).toBe(1)
    })

    it('stores crafted outputs and invokes recipe post-processing', () => {
        const afterCrafting = vi.fn()
        const recipe: Recipe = {
            id: 'TestCraftedRecipe',
            nameId: 'Plank',
            iconId: Icons.Plank,
            type: RecipeTypes.Woodworking,
            getParameters: () => [],
            getResult: () => ({
                time: 1,
                requirements: [{ itemId: 'OakLog', qta: 1 }],
                results: [
                    {
                        id: 'crafted',
                        qta: 1,
                        craftedItem: {
                            id: '',
                            nameId: 'Plank',
                            icon: Icons.Plank,
                            type: ItemType.Crafting,
                            craftingTypes: [CraftingType.Plank],
                            value: 1,
                            volume: 1,
                        },
                    },
                ],
            }),
            afterCrafting,
        }
        recipes.set(recipe.id, recipe)

        try {
            addCrafting(recipe.id)
            addItem(state, 'OakLog', 1)

            execCrafting(state, timer)

            expect(afterCrafting).toHaveBeenCalledWith(state, [], expect.objectContaining({ time: 1 }))
            const craftedId = state.craftedItems.ids[0]
            expect(craftedId).toMatch(/^C_/)
            expect(state.locations.entries[state.location]!.storage.entries[craftedId!]?.quantity).toBe(1)
        } finally {
            recipes.delete(recipe.id)
        }
    })

    it('does not partially purchase or consume requirements when auto-buy is unaffordable', () => {
        addCrafting('PlankRecipe', [{ id: 'log', itemId: 'OakLog' }], { OakLog: true })
        state.gold = 0

        execCrafting(state, timer)

        expect(state.gold).toBe(0)
        expect(state.locations.entries[state.location]!.storage.entries.OakLog).toBeUndefined()
        expect(ActivityAdapter.select(state.activities, 'crafting')).toBeUndefined()
    })
})
