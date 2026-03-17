import { CharTemplatesData } from '../../characters/templates/charTemplateData'
import { GameState } from '../../game/GameState'
import { selectTranslations } from '../../msg/useTranslations'
import { QuestAdapter, QuestOutcome, QuestState, QuestStatus } from '../../quests/QuestTypes'
import { BaseQuestTemplate } from '../../quests/templates/BaseQuestTemplate'
import { getUniqueId } from '../../utils/getUniqueId'
import { GatheringData } from '../gatheringData'
import { GatheringZoneConfig } from '../gatheringTypes'
import { GatheringZone } from '../gatheringZones'
import { MakeGatheringZoneUnlockQuestData } from './MakeGatheringZoneUnlockQuestData'
export class UnlockZoneQuest extends BaseQuestTemplate<MakeGatheringZoneUnlockQuestData> {
    id = 'UnlockZoneQuest'
    visible = false
    nextQuestId = undefined
    private selectData(id: string, state: GameState): MakeGatheringZoneUnlockQuestData {
        const quest = QuestAdapter.selectEx(state.quests, id)
        if (!quest.parameters) throw new Error('Parameters are required for UnlockZoneQuest')
        return quest.parameters as MakeGatheringZoneUnlockQuestData
    }
    private selectZoneConfig(id: string, state: GameState): GatheringZoneConfig {
        const zoneId = this.selectData(id, state).zone
        const zoneConfig = GatheringData[zoneId]
        if (!zoneConfig) throw new Error('Zone config is required for UnlockZoneQuest')
        return zoneConfig
    }
    generateQuestData = (_state: GameState, data?: MakeGatheringZoneUnlockQuestData) => {
        if (!data) throw new Error('Data is required for UnlockZoneQuest')

        const defeat: QuestOutcome = {
            id: 'defeat',
            location: data.location,
            goldReward: 0,
            unlockGatheringZone: data.zone,
        }

        const quest: QuestState = {
            id: getUniqueId(),
            state: QuestStatus.AVAILABLE,
            templateId: 'SupplyQuest',
            parameters: data,
            expandedOutcome: 'defeat',
            outcomeData: {
                ids: ['defeat'],
                entries: {
                    ['defeat']: defeat,
                },
            },
        }

        return quest
    }
    getName = (id: string) => (state: GameState) =>
        selectTranslations(state).fun.UnlockQuest(this.selectZoneConfig(id, state).nameId)
    getDescription = (_id: string) => (_state: GameState) => '' // ToDo
    getIcon = (id: string) => (state: GameState) => this.selectZoneConfig(id, state).iconId
    getOutcomeTitle = (_questId: string, outcomeId: string) => (state: GameState) => {
        const quest = QuestAdapter.selectEx(state.quests, this.id)
        if (!quest) return ''

        if (outcomeId === 'defeat') {
            const t = selectTranslations(state)
            if (!quest.parameters) return ''
            if (
                !(
                    'enemies' in quest.parameters &&
                    quest.parameters.enemies &&
                    typeof quest.parameters.enemies === 'object'
                )
            )
                return t.t.KillToUnlock

            const params = quest.parameters as MakeGatheringZoneUnlockQuestData | undefined
            const enemy = params?.enemies?.[0]?.templateId
            if (!enemy) return ''
            const enemyNameId = CharTemplatesData[enemy].nameId
            return t.fun.KillToUnlock(enemyNameId)
        }

        return ''
    }
    getOutcomeDescription = (_questId: string, _outcomeId: string) => (_state: GameState) => '' // ToDo
    getGatheringZoneUnlock?: ((questId: string, outcomeId: string) => (state: GameState) => GatheringZone) | undefined
}
