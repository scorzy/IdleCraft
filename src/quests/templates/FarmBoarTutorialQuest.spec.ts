import { beforeAll, describe, expect, it } from 'vitest'
import { AlchemyItems } from '../../alchemy/alchemyItems'
import { generatePotion } from '../../alchemy/alchemyFunctions'
import { Effects } from '../../effects/types/Effects'
import { GetInitialGameState } from '../../game/InitialGameState'
import { initialize } from '../../game/functions/initialize'
import { forestGatheringConfig } from '../../gathering/data/forestGathering'
import { completeQuest } from '../QuestFunctions'
import { QuestAdapter } from '../QuestTypes'
import {
    FARM_BOAR_FENCE_OUTCOME_ID,
    FARM_BOAR_KILL_COUNT,
    FARM_BOAR_KILL_OUTCOME_ID,
    FARM_BOAR_LOG_COUNT,
    FARM_BOAR_POTION_COUNT,
    FARM_BOAR_REPELLENT_OUTCOME_ID,
    FARM_BOAR_TUTORIAL_ID,
    FarmBoarTutorialQuest,
} from './FarmBoarTutorialQuest'
import {
    ALCHEMIST_APPRENTICESHIP_QUEST_ID,
    CARPENTER_APPRENTICESHIP_QUEST_ID,
    CRAFT_HANDLE_OUTCOME_ID,
    CRAFT_PLANK_OUTCOME_ID,
    FAMILY_FARM_CRAFTING_TUTORIAL_ID,
    FAMILY_FARM_GATHERING_OUTCOME_ID,
    FAMILY_FARM_GATHERING_TUTORIAL_ID,
    HUNTER_APPRENTICESHIP_QUEST_ID,
    SMELT_COPPER_BAR_OUTCOME_ID,
    STARTER_MATERIAL_COUNT,
    FamilyFarmCraftingTutorialQuest,
    FamilyFarmGatheringTutorialQuest,
} from './FamilyFarmTutorialQuests'
import { QuestStatus } from '../QuestTypes'

beforeAll(() => initialize())

describe('FarmBoarTutorialQuest', () => {
    it('starts the family-farm tutorial accepted with starter material requests', () => {
        const state = GetInitialGameState()
        const quest = new FamilyFarmGatheringTutorialQuest().generateQuestData(state)

        expect(quest).toMatchObject({
            main: true,
            state: QuestStatus.ACCEPTED,
            templateId: FAMILY_FARM_GATHERING_TUTORIAL_ID,
        })
        expect(quest.outcomeData.entries[FAMILY_FARM_GATHERING_OUTCOME_ID]?.reqItems).toEqual([
            { id: 'DeadWoodLogs', itemCount: STARTER_MATERIAL_COUNT, itemFilter: { itemId: 'DeadTreeLog' } },
            { id: 'CopperOre', itemCount: STARTER_MATERIAL_COUNT, itemFilter: { itemId: 'CopperOre' } },
        ])
    })

    it('offers three starter crafting options before the family farm boar quest', () => {
        const state = GetInitialGameState()
        const quest = new FamilyFarmCraftingTutorialQuest().generateQuestData(state)

        expect(quest).toMatchObject({
            main: true,
            state: QuestStatus.ACCEPTED,
            templateId: FAMILY_FARM_CRAFTING_TUTORIAL_ID,
        })
        expect(quest.outcomeData.ids).toEqual([
            CRAFT_PLANK_OUTCOME_ID,
            CRAFT_HANDLE_OUTCOME_ID,
            SMELT_COPPER_BAR_OUTCOME_ID,
        ])
        expect(new FamilyFarmCraftingTutorialQuest().nextQuestId).toBe(FARM_BOAR_TUTORIAL_ID)
    })

    it('offers the three requested solutions with deterministic quantities', () => {
        const state = GetInitialGameState()
        const quest = new FarmBoarTutorialQuest().generateQuestData(state)

        expect(quest).toMatchObject({ main: true, state: QuestStatus.ACCEPTED })

        expect(quest.outcomeData.ids).toEqual([
            FARM_BOAR_KILL_OUTCOME_ID,
            FARM_BOAR_FENCE_OUTCOME_ID,
            FARM_BOAR_REPELLENT_OUTCOME_ID,
        ])
        expect(quest.outcomeData.entries[FARM_BOAR_KILL_OUTCOME_ID]?.targets?.[0]?.targetCount).toBe(
            FARM_BOAR_KILL_COUNT
        )
        expect(quest.outcomeData.entries[FARM_BOAR_FENCE_OUTCOME_ID]?.reqItems?.[0]?.itemCount).toBe(
            FARM_BOAR_LOG_COUNT
        )
        expect(quest.outcomeData.entries[FARM_BOAR_REPELLENT_OUTCOME_ID]?.reqItems?.[0]).toMatchObject({
            itemCount: FARM_BOAR_POTION_COUNT,
            itemFilter: { potionEffects: [Effects.DamageStamina] },
        })
    })

    it('creates a hunter apprenticeship quest after the boar hunt path is completed', () => {
        const state = GetInitialGameState()
        const tutorial = new FarmBoarTutorialQuest().generateQuestData(state)
        tutorial.state = QuestStatus.ACCEPTED
        QuestAdapter.create(state.quests, tutorial)

        tutorial.outcomeData.entries[FARM_BOAR_KILL_OUTCOME_ID]!.targets![0]!.killedCount = FARM_BOAR_KILL_COUNT
        completeQuest(state, tutorial.id, FARM_BOAR_KILL_OUTCOME_ID)

        expect(state.completedQuestTemplates).toContain(FARM_BOAR_TUTORIAL_ID)
        expect(QuestAdapter.find(state.quests, (quest) => quest.templateId === FARM_BOAR_TUTORIAL_ID)).toBeUndefined()
        expect(
            QuestAdapter.find(state.quests, (quest) => quest.templateId === HUNTER_APPRENTICESHIP_QUEST_ID)
        ).toMatchObject({
            main: true,
            state: QuestStatus.ACCEPTED,
        })
    })

    it('routes each family farm solution to its related apprenticeship', () => {
        const template = new FarmBoarTutorialQuest()

        expect(template.getNextQuestId('', FARM_BOAR_KILL_OUTCOME_ID)).toBe(HUNTER_APPRENTICESHIP_QUEST_ID)
        expect(template.getNextQuestId('', FARM_BOAR_FENCE_OUTCOME_ID)).toBe(CARPENTER_APPRENTICESHIP_QUEST_ID)
        expect(template.getNextQuestId('', FARM_BOAR_REPELLENT_OUTCOME_ID)).toBe(ALCHEMIST_APPRENTICESHIP_QUEST_ID)
    })

    it('adds gatherable ingredients that brew a Damage Stamina poison', () => {
        const state = GetInitialGameState()
        const potion = generatePotion(state, true, [AlchemyItems.BitterRoot!, AlchemyItems.Nightshade!])

        expect(forestGatheringConfig.resources.map((resource) => resource.id)).toEqual(
            expect.arrayContaining(['BitterRoot', 'Nightshade'])
        )
        expect(potion?.item?.potionData?.effects).toEqual(
            expect.arrayContaining([expect.objectContaining({ effect: Effects.DamageStamina })])
        )
    })
})
