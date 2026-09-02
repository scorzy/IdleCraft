import { Effects } from '../../effects/types/Effects'
import { GameState } from '../../game/GameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { Icons } from '../../icons/Icons'
import { CraftingType, ItemType } from '../../items/Item'
import { selectTranslations } from '../../msg/useTranslations'
import { getUniqueId } from '../../utils/getUniqueId'
import { GenerateQuestDataData } from '../QuestTemplate'
import { QuestOutcome, QuestState, QuestStatus } from '../QuestTypes'
import { BaseQuestTemplate } from './BaseQuestTemplate'

export const FAMILY_FARM_GATHERING_TUTORIAL_ID = 'FamilyFarmGatheringTutorial'
export const FAMILY_FARM_CRAFTING_TUTORIAL_ID = 'FamilyFarmCraftingTutorial'
export const HUNTER_APPRENTICESHIP_QUEST_ID = 'HunterApprenticeship'
export const CARPENTER_APPRENTICESHIP_QUEST_ID = 'CarpenterApprenticeship'
export const ALCHEMIST_APPRENTICESHIP_QUEST_ID = 'AlchemistApprenticeship'

export const FAMILY_FARM_GATHERING_OUTCOME_ID = 'GatherSupplies'
export const CRAFT_PLANK_OUTCOME_ID = 'CraftPlank'
export const CRAFT_HANDLE_OUTCOME_ID = 'CraftHandle'
export const SMELT_COPPER_BAR_OUTCOME_ID = 'SmeltCopperBar'
export const HUNTER_APPRENTICESHIP_OUTCOME_ID = 'HuntWolves'
export const CARPENTER_APPRENTICESHIP_OUTCOME_ID = 'CraftPlanks'
export const ALCHEMIST_APPRENTICESHIP_OUTCOME_ID = 'BrewPoison'

export const STARTER_MATERIAL_COUNT = 10

function createMainQuest(templateId: string, state: QuestStatus, outcomes: QuestOutcome[]): QuestState {
    return {
        id: getUniqueId(),
        state,
        main: true,
        templateId,
        expandedOutcome: outcomes[0]?.id ?? '',
        outcomeData: {
            ids: outcomes.map((outcome) => outcome.id),
            entries: Object.fromEntries(outcomes.map((outcome) => [outcome.id, outcome])),
        },
    }
}

export class FamilyFarmGatheringTutorialQuest extends BaseQuestTemplate<GenerateQuestDataData> {
    id = FAMILY_FARM_GATHERING_TUTORIAL_ID
    nextQuestId = FAMILY_FARM_CRAFTING_TUTORIAL_ID

    getName = () => (state: GameState) => selectTranslations(state).t.FamilyFarmGatheringName
    getDescription = () => (state: GameState) => selectTranslations(state).t.FamilyFarmGatheringDescription
    getIcon = () => () => Icons.Log
    getOutcomeTitle = () => (state: GameState) => selectTranslations(state).t.FamilyFarmGatheringOutcomeTitle
    getOutcomeDescription = () => (state: GameState) =>
        selectTranslations(state).t.FamilyFarmGatheringOutcomeDescription

    generateQuestData = (_state: GameState) =>
        createMainQuest(FAMILY_FARM_GATHERING_TUTORIAL_ID, QuestStatus.ACCEPTED, [
            {
                id: FAMILY_FARM_GATHERING_OUTCOME_ID,
                location: GameLocations.StartVillage,
                reqItems: [
                    {
                        id: 'DeadWoodLogs',
                        itemCount: STARTER_MATERIAL_COUNT,
                        itemFilter: { itemId: 'DeadTreeLog' },
                    },
                    {
                        id: 'CopperOre',
                        itemCount: STARTER_MATERIAL_COUNT,
                        itemFilter: { itemId: 'CopperOre' },
                    },
                ],
            },
        ])
}

export class FamilyFarmCraftingTutorialQuest extends BaseQuestTemplate<GenerateQuestDataData> {
    id = FAMILY_FARM_CRAFTING_TUTORIAL_ID
    nextQuestId = 'FarmBoarTutorial'

    getName = () => (state: GameState) => selectTranslations(state).t.FamilyFarmCraftingName
    getDescription = () => (state: GameState) => selectTranslations(state).t.FamilyFarmCraftingDescription
    getIcon = () => () => Icons.Handle
    getOutcomeTitle = (_questId: string, outcomeId: string) => (state: GameState) => {
        const t = selectTranslations(state).t
        if (outcomeId === CRAFT_PLANK_OUTCOME_ID) return t.FamilyFarmCraftPlankTitle
        if (outcomeId === CRAFT_HANDLE_OUTCOME_ID) return t.FamilyFarmCraftHandleTitle
        if (outcomeId === SMELT_COPPER_BAR_OUTCOME_ID) return t.FamilyFarmSmeltCopperTitle
        return ''
    }
    getOutcomeDescription = (_questId: string, outcomeId: string) => (state: GameState) => {
        const t = selectTranslations(state).t
        if (outcomeId === CRAFT_PLANK_OUTCOME_ID) return t.FamilyFarmCraftPlankDescription
        if (outcomeId === CRAFT_HANDLE_OUTCOME_ID) return t.FamilyFarmCraftHandleDescription
        if (outcomeId === SMELT_COPPER_BAR_OUTCOME_ID) return t.FamilyFarmSmeltCopperDescription
        return ''
    }

    generateQuestData = (_state: GameState) =>
        createMainQuest(FAMILY_FARM_CRAFTING_TUTORIAL_ID, QuestStatus.AVAILABLE, [
            {
                id: CRAFT_PLANK_OUTCOME_ID,
                location: GameLocations.StartVillage,
                reqItems: [{ id: 'Plank', itemCount: 1, itemFilter: { itemId: 'DeadTreePlank' } }],
            },
            {
                id: CRAFT_HANDLE_OUTCOME_ID,
                location: GameLocations.StartVillage,
                reqItems: [{ id: 'Handle', itemCount: 1, itemFilter: { itemId: 'DeadTreeHandle' } }],
            },
            {
                id: SMELT_COPPER_BAR_OUTCOME_ID,
                location: GameLocations.StartVillage,
                reqItems: [{ id: 'CopperBar', itemCount: 1, itemFilter: { itemId: 'CopperBar' } }],
            },
        ])
}

export class HunterApprenticeshipQuest extends BaseQuestTemplate<GenerateQuestDataData> {
    id = HUNTER_APPRENTICESHIP_QUEST_ID
    nextQuestId = undefined

    getName = () => (state: GameState) => selectTranslations(state).t.HunterApprenticeshipName
    getDescription = () => (state: GameState) => selectTranslations(state).t.HunterApprenticeshipDescription
    getIcon = () => () => Icons.Boar
    getOutcomeTitle = () => (state: GameState) => selectTranslations(state).t.HunterApprenticeshipOutcomeTitle
    getOutcomeDescription = () => (state: GameState) =>
        selectTranslations(state).t.HunterApprenticeshipOutcomeDescription

    generateQuestData = (_state: GameState) =>
        createMainQuest(HUNTER_APPRENTICESHIP_QUEST_ID, QuestStatus.AVAILABLE, [
            {
                id: HUNTER_APPRENTICESHIP_OUTCOME_ID,
                location: GameLocations.StartVillage,
                targets: [{ targetId: 'Wolf', targetCount: 5, killedCount: 0 }],
            },
        ])
}

export class CarpenterApprenticeshipQuest extends BaseQuestTemplate<GenerateQuestDataData> {
    id = CARPENTER_APPRENTICESHIP_QUEST_ID
    nextQuestId = undefined

    getName = () => (state: GameState) => selectTranslations(state).t.CarpenterApprenticeshipName
    getDescription = () => (state: GameState) => selectTranslations(state).t.CarpenterApprenticeshipDescription
    getIcon = () => () => Icons.Plank
    getOutcomeTitle = () => (state: GameState) => selectTranslations(state).t.CarpenterApprenticeshipOutcomeTitle
    getOutcomeDescription = () => (state: GameState) =>
        selectTranslations(state).t.CarpenterApprenticeshipOutcomeDescription

    generateQuestData = (_state: GameState) =>
        createMainQuest(CARPENTER_APPRENTICESHIP_QUEST_ID, QuestStatus.AVAILABLE, [
            {
                id: CARPENTER_APPRENTICESHIP_OUTCOME_ID,
                location: GameLocations.StartVillage,
                reqItems: [
                    {
                        id: 'Planks',
                        itemCount: 10,
                        itemFilter: { itemType: ItemType.Crafting, craftingTypes: [CraftingType.Plank] },
                    },
                ],
            },
        ])
}

export class AlchemistApprenticeshipQuest extends BaseQuestTemplate<GenerateQuestDataData> {
    id = ALCHEMIST_APPRENTICESHIP_QUEST_ID
    nextQuestId = undefined

    getName = () => (state: GameState) => selectTranslations(state).t.AlchemistApprenticeshipName
    getDescription = () => (state: GameState) => selectTranslations(state).t.AlchemistApprenticeshipDescription
    getIcon = () => () => Icons.Potion
    getOutcomeTitle = () => (state: GameState) => selectTranslations(state).t.AlchemistApprenticeshipOutcomeTitle
    getOutcomeDescription = () => (state: GameState) =>
        selectTranslations(state).t.AlchemistApprenticeshipOutcomeDescription

    generateQuestData = (_state: GameState) =>
        createMainQuest(ALCHEMIST_APPRENTICESHIP_QUEST_ID, QuestStatus.AVAILABLE, [
            {
                id: ALCHEMIST_APPRENTICESHIP_OUTCOME_ID,
                location: GameLocations.StartVillage,
                reqItems: [
                    {
                        id: 'Poison',
                        itemCount: 1,
                        itemFilter: {
                            itemType: ItemType.Consumable,
                            potionEffects: [Effects.DamageStamina],
                        },
                    },
                ],
            },
        ])
}
