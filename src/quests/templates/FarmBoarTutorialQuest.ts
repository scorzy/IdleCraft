import { Effects } from '../../effects/types/Effects'
import { GameState } from '../../game/GameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { Icons } from '../../icons/Icons'
import { ItemType, CraftingType } from '../../items/Item'
import { selectTranslations } from '../../msg/useTranslations'
import { getUniqueId } from '../../utils/getUniqueId'
import { GenerateQuestDataData } from '../QuestTemplate'
import { QuestOutcome, QuestState, QuestStatus } from '../QuestTypes'
import { BaseQuestTemplate } from './BaseQuestTemplate'

export const FARM_BOAR_TUTORIAL_ID = 'FarmBoarTutorial'
export const FARM_BOAR_KILL_OUTCOME_ID = 'HuntBoars'
export const FARM_BOAR_FENCE_OUTCOME_ID = 'BuildFence'
export const FARM_BOAR_REPELLENT_OUTCOME_ID = 'BrewRepellent'
export const FARM_BOAR_KILL_COUNT = 10
export const FARM_BOAR_LOG_COUNT = 30
export const FARM_BOAR_POTION_COUNT = 3

export class FarmBoarTutorialQuest extends BaseQuestTemplate<GenerateQuestDataData> {
    id = FARM_BOAR_TUTORIAL_ID
    nextQuestId = undefined

    getName = () => (state: GameState) => selectTranslations(state).t.FarmBoarTutorialName
    getDescription = () => (state: GameState) => selectTranslations(state).t.FarmBoarTutorialDescription
    getIcon = () => () => Icons.Boar

    getOutcomeTitle = (_questId: string, outcomeId: string) => (state: GameState) => {
        const t = selectTranslations(state).t
        if (outcomeId === FARM_BOAR_KILL_OUTCOME_ID) return t.FarmBoarHuntTitle
        if (outcomeId === FARM_BOAR_FENCE_OUTCOME_ID) return t.FarmBoarFenceTitle
        if (outcomeId === FARM_BOAR_REPELLENT_OUTCOME_ID) return t.FarmBoarRepellentTitle
        return ''
    }

    getOutcomeDescription = (_questId: string, outcomeId: string) => (state: GameState) => {
        const t = selectTranslations(state).t
        if (outcomeId === FARM_BOAR_KILL_OUTCOME_ID) return t.FarmBoarHuntDescription
        if (outcomeId === FARM_BOAR_FENCE_OUTCOME_ID) return t.FarmBoarFenceDescription
        if (outcomeId === FARM_BOAR_REPELLENT_OUTCOME_ID) return t.FarmBoarRepellentDescription
        return ''
    }

    generateQuestData = (_state: GameState): QuestState => {
        const hunt: QuestOutcome = {
            id: FARM_BOAR_KILL_OUTCOME_ID,
            location: GameLocations.StartVillage,
            goldReward: 100,
            targets: [
                {
                    targetId: 'Boar',
                    targetCount: FARM_BOAR_KILL_COUNT,
                    killedCount: 0,
                },
            ],
        }

        const fence: QuestOutcome = {
            id: FARM_BOAR_FENCE_OUTCOME_ID,
            location: GameLocations.StartVillage,
            goldReward: 100,
            reqItems: [
                {
                    id: 'FenceLogs',
                    itemCount: FARM_BOAR_LOG_COUNT,
                    itemFilter: { itemType: ItemType.Crafting, craftingTypes: [CraftingType.Log] },
                },
            ],
        }

        const repellent: QuestOutcome = {
            id: FARM_BOAR_REPELLENT_OUTCOME_ID,
            location: GameLocations.StartVillage,
            goldReward: 100,
            reqItems: [
                {
                    id: 'StaminaPoison',
                    itemCount: FARM_BOAR_POTION_COUNT,
                    itemFilter: {
                        descriptionId: 'DamageStaminaPotion',
                        itemType: ItemType.Consumable,
                        potionEffects: [Effects.DamageStamina],
                    },
                },
            ],
        }

        return {
            id: getUniqueId(),
            state: QuestStatus.AVAILABLE,
            main: true,
            templateId: FARM_BOAR_TUTORIAL_ID,
            expandedOutcome: FARM_BOAR_KILL_OUTCOME_ID,
            outcomeData: {
                ids: [FARM_BOAR_KILL_OUTCOME_ID, FARM_BOAR_FENCE_OUTCOME_ID, FARM_BOAR_REPELLENT_OUTCOME_ID],
                entries: {
                    [FARM_BOAR_KILL_OUTCOME_ID]: hunt,
                    [FARM_BOAR_FENCE_OUTCOME_ID]: fence,
                    [FARM_BOAR_REPELLENT_OUTCOME_ID]: repellent,
                },
            },
        }
    }
}
