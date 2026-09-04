import { GameState } from '../../game/GameState'
import { FARM_BOAR_TUTORIAL_ID } from '../../quests/templates/FarmBoarTutorialQuest'
import {
    FAMILY_FARM_CRAFTING_TUTORIAL_ID,
    FAMILY_FARM_GATHERING_TUTORIAL_ID,
} from '../../quests/templates/FamilyFarmTutorialQuests'
import { UiPages } from './UiPages'

export type PageUnlockRule = (state: GameState) => boolean

export const pageUnlockRules: Partial<Record<UiPages, PageUnlockRule>> = {
    [UiPages.Characters]: (state) => state.completedQuestTemplates.includes(FAMILY_FARM_CRAFTING_TUTORIAL_ID),
    [UiPages.Woodworking]: (state) => state.completedQuestTemplates.includes(FAMILY_FARM_GATHERING_TUTORIAL_ID),
    [UiPages.Smithing]: (state) => state.completedQuestTemplates.includes(FAMILY_FARM_GATHERING_TUTORIAL_ID),
    [UiPages.CombatZones]: (state) => state.completedQuestTemplates.includes(FAMILY_FARM_CRAFTING_TUTORIAL_ID),
    [UiPages.Combat]: (state) => state.completedQuestTemplates.includes(FAMILY_FARM_CRAFTING_TUTORIAL_ID),
    [UiPages.World]: (state) => state.completedQuestTemplates.includes(FARM_BOAR_TUTORIAL_ID),
    [UiPages.Caravans]: (state) => state.completedQuestTemplates.includes(FARM_BOAR_TUTORIAL_ID),
    [UiPages.Butchering]: (state) => state.completedQuestTemplates.includes(FARM_BOAR_TUTORIAL_ID),
    [UiPages.Alchemy]: (state) => state.completedQuestTemplates.includes(FAMILY_FARM_CRAFTING_TUTORIAL_ID),
}

export const isPageUnlocked = (state: GameState, page: UiPages): boolean => {
    if (!state.pageUnlockProgressionEnabled) return true
    return pageUnlockRules[page]?.(state) ?? true
}

export const selectPageUnlocked = (page: UiPages) => (state: GameState) => isPageUnlocked(state, page)

export const selectAnyPageUnlocked = (pages: UiPages[]) => (state: GameState) =>
    pages.some((page) => isPageUnlocked(state, page))
