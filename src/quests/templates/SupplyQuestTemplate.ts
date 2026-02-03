import { AlchemyItems } from '../../alchemy/alchemyItems'
import { GameState } from '../../game/GameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { Icons } from '../../icons/Icons'
import { MiningItems } from '../../mining/MiningItems'
import { getUniqueId } from '../../utils/getUniqueId'
import { WoodItems } from '../../wood/WoodItems'
import { QuestState, QuestOutcome, QuestStatus } from '../QuestTypes'
import { BaseQuestTemplate } from './BaseQuestTemplate'

const SUPPLY_QTA = 100
const ALCHEMY_OUTCOME_ID = 'Alchemy'
const WOOD_OUTCOME_ID = 'Wood'
const MINING_OUTCOME_ID = 'Mining'

export class SupplyQuestTemplate extends BaseQuestTemplate {
    nextQuestId = 'SupplyQuest'
    id = 'SupplyQuest'
    getName = (_questId: string) => (_state: GameState) => 'Supply Quest'

    getDescription = (_questId: string) => (_state: GameState) => 'Free supply'

    getIcon = (_id: string) => (_state: GameState) => Icons.Axe
    getOutcomeTitle: (questId: string, outcomeId: string) => (state: GameState) => string =
        (_questId, outcomeId) => (_state) => {
            if (outcomeId === ALCHEMY_OUTCOME_ID) return 'Alchemy Supply'
            else if (outcomeId === WOOD_OUTCOME_ID) return 'Wood Supply'
            else if (outcomeId === MINING_OUTCOME_ID) return 'Mining Supply'
            else return ''
        }
    getOutcomeDescription = (_questId: string, outcomeId: string) => (_state: GameState) => {
        if (outcomeId === ALCHEMY_OUTCOME_ID) return 'Alchemy Supply'
        else if (outcomeId === WOOD_OUTCOME_ID) return 'Wood Supply'
        else if (outcomeId === MINING_OUTCOME_ID) return 'Mining Supply'
        else return ''
    }

    generateQuestData = (_state: GameState) => {
        const quantity = SUPPLY_QTA + Math.floor(Math.random() * 100)

        const alchemy: QuestOutcome = {
            id: ALCHEMY_OUTCOME_ID,
            location: GameLocations.StartVillage,
            goldReward: 0,
            itemsRewards: Object.entries(AlchemyItems)
                .filter(([, item]) => !item.unlimited)
                .map(([itemId]) => ({
                    itemId,
                    quantity,
                })),
        }

        const wood: QuestOutcome = {
            id: WOOD_OUTCOME_ID,
            location: GameLocations.StartVillage,
            goldReward: 0,
            itemsRewards: Object.entries(WoodItems).map(([itemId]) => ({
                itemId,
                quantity,
            })),
        }

        const mining: QuestOutcome = {
            id: MINING_OUTCOME_ID,
            location: GameLocations.StartVillage,
            goldReward: 0,
            itemsRewards: Object.entries(MiningItems).map(([itemId]) => ({
                itemId,
                quantity,
            })),
        }

        const quest: QuestState = {
            id: getUniqueId(),
            state: QuestStatus.AVAILABLE,
            templateId: 'SupplyQuest',
            parameters: {},
            expandedOutcome: ALCHEMY_OUTCOME_ID,
            outcomeData: {
                ids: [ALCHEMY_OUTCOME_ID, WOOD_OUTCOME_ID, MINING_OUTCOME_ID],
                entries: {
                    [ALCHEMY_OUTCOME_ID]: alchemy,
                    [WOOD_OUTCOME_ID]: wood,
                    [MINING_OUTCOME_ID]: mining,
                },
            },
        }

        return quest
    }
}
