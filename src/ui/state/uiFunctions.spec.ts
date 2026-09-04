import { describe, expect, it } from 'vitest'
import { GetInitialGameState } from '../../game/InitialGameState'
import { FAMILY_FARM_GATHERING_TUTORIAL_ID } from '../../quests/templates/FamilyFarmTutorialQuests'
import { UiPages } from './UiPages'
import { setPageState } from './uiFunctions'

describe('setPageState', () => {
    it('opens a locked page without changing crafting selection state', () => {
        const state = GetInitialGameState()
        state.ui.recipeType = undefined
        state.recipeId = 'existing-recipe'

        setPageState(state, UiPages.Woodworking)

        expect(state.ui.page).toBe(UiPages.Woodworking)
        expect(state.ui.recipeType).toBeUndefined()
        expect(state.recipeId).toBe('existing-recipe')
    })

    it('updates crafting selection state after the page becomes unlocked', () => {
        const state = GetInitialGameState()
        state.completedQuestTemplates.push(FAMILY_FARM_GATHERING_TUTORIAL_ID)

        setPageState(state, UiPages.Woodworking)

        expect(state.ui.recipeType).toBeDefined()
    })
})
