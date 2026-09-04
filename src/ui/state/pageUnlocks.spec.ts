import { describe, expect, it } from 'vitest'
import { PLAYER_ID } from '../../characters/charactersConst'
import { GetInitialGameState } from '../../game/InitialGameState'
import { FARM_BOAR_TUTORIAL_ID } from '../../quests/templates/FarmBoarTutorialQuest'
import {
    FAMILY_FARM_CRAFTING_TUTORIAL_ID,
    FAMILY_FARM_GATHERING_TUTORIAL_ID,
} from '../../quests/templates/FamilyFarmTutorialQuests'
import { UiPages } from './UiPages'
import { isPageUnlocked, selectAnyPageUnlocked } from './pageUnlocks'

describe('page unlocks', () => {
    it('locks configured pages for a new game and leaves all other pages available', () => {
        const state = GetInitialGameState()

        expect(isPageUnlocked(state, UiPages.Characters)).toBe(false)
        expect(isPageUnlocked(state, UiPages.World)).toBe(false)
        expect(isPageUnlocked(state, UiPages.Caravans)).toBe(false)
        expect(isPageUnlocked(state, UiPages.CombatZones)).toBe(false)
        expect(isPageUnlocked(state, UiPages.Combat)).toBe(false)
        expect(isPageUnlocked(state, UiPages.Woodworking)).toBe(false)
        expect(isPageUnlocked(state, UiPages.Smithing)).toBe(false)
        expect(isPageUnlocked(state, UiPages.Butchering)).toBe(false)
        expect(isPageUnlocked(state, UiPages.Alchemy)).toBe(false)
        expect(isPageUnlocked(state, UiPages.Activities)).toBe(true)
    })

    it('unlocks pages after their required tutorial or level milestone', () => {
        const state = GetInitialGameState()
        state.characters.entries[PLAYER_ID]!.level = 1
        state.completedQuestTemplates.push(FAMILY_FARM_GATHERING_TUTORIAL_ID)

        expect(isPageUnlocked(state, UiPages.Characters)).toBe(false)
        expect(isPageUnlocked(state, UiPages.Woodworking)).toBe(true)
        expect(isPageUnlocked(state, UiPages.Smithing)).toBe(true)
        expect(isPageUnlocked(state, UiPages.CombatZones)).toBe(false)

        state.completedQuestTemplates.push(FAMILY_FARM_CRAFTING_TUTORIAL_ID)
        expect(isPageUnlocked(state, UiPages.CombatZones)).toBe(true)
        expect(isPageUnlocked(state, UiPages.Combat)).toBe(true)

        state.completedQuestTemplates.push(FARM_BOAR_TUTORIAL_ID)
        expect(isPageUnlocked(state, UiPages.World)).toBe(true)
        expect(isPageUnlocked(state, UiPages.Caravans)).toBe(true)
        expect(isPageUnlocked(state, UiPages.Butchering)).toBe(true)
        expect(isPageUnlocked(state, UiPages.Alchemy)).toBe(true)
    })

    it('keeps every page unlocked when progression is disabled for a legacy save', () => {
        const state = GetInitialGameState()
        state.pageUnlockProgressionEnabled = false

        expect(Object.values(UiPages).every((page) => isPageUnlocked(state, page))).toBe(true)
    })

    it('reports a page group as unavailable only when every child page is locked', () => {
        const state = GetInitialGameState()
        const craftingPages = [UiPages.Woodworking, UiPages.Smithing, UiPages.Butchering, UiPages.Alchemy]
        const combatPages = [UiPages.CombatZones, UiPages.Combat]

        expect(selectAnyPageUnlocked(craftingPages)(state)).toBe(false)
        expect(selectAnyPageUnlocked(combatPages)(state)).toBe(false)

        state.completedQuestTemplates.push(FAMILY_FARM_GATHERING_TUTORIAL_ID)
        expect(selectAnyPageUnlocked(craftingPages)(state)).toBe(true)
        expect(selectAnyPageUnlocked(combatPages)(state)).toBe(false)
    })
})
