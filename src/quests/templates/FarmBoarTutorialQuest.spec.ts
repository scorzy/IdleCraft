import { beforeAll, describe, expect, it } from 'vitest'
import { AlchemyItems } from '../../alchemy/alchemyItems'
import { generatePotion } from '../../alchemy/alchemyFunctions'
import { Effects } from '../../effects/types/Effects'
import { GetInitialGameState } from '../../game/InitialGameState'
import { initialize } from '../../game/functions/initialize'
import { forestGatheringConfig } from '../../gathering/data/forestGathering'
import { acceptQuest, completeQuest, updateQuests } from '../QuestFunctions'
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

beforeAll(() => initialize())

describe('FarmBoarTutorialQuest', () => {
    it('offers the three requested solutions with deterministic quantities', () => {
        const state = GetInitialGameState()
        const quest = new FarmBoarTutorialQuest().generateQuestData(state)

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

    it('uses translated text and presents equipment only as a suggestion', () => {
        const state = GetInitialGameState()
        const quest = new FarmBoarTutorialQuest().generateQuestData(state)
        QuestAdapter.create(state.quests, quest)

        expect(new FarmBoarTutorialQuest().getName()(state)).toBe('Boars at the Family Farm')
        expect(new FarmBoarTutorialQuest().getOutcomeDescription(quest.id, FARM_BOAR_KILL_OUTCOME_ID)(state)).toContain(
            'Suggested preparation'
        )
    })

    it('is generated once and does not return after one solution is completed', () => {
        const state = GetInitialGameState()
        updateQuests(state)
        const tutorial = QuestAdapter.find(state.quests, (quest) => quest.templateId === FARM_BOAR_TUTORIAL_ID)!
        acceptQuest(state, tutorial.id)

        tutorial.outcomeData.entries[FARM_BOAR_KILL_OUTCOME_ID]!.targets![0]!.killedCount = FARM_BOAR_KILL_COUNT
        completeQuest(state, tutorial.id, FARM_BOAR_KILL_OUTCOME_ID)
        updateQuests(state)

        expect(state.completedQuestTemplates).toContain(FARM_BOAR_TUTORIAL_ID)
        expect(QuestAdapter.find(state.quests, (quest) => quest.templateId === FARM_BOAR_TUTORIAL_ID)).toBeUndefined()
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
