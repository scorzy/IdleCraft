import { CharacterAdapter } from '../../characters/characterAdapter'
import { GameState } from '../../game/GameState'
import { QuestData } from '../QuestData'
import { completeQuest } from '../QuestFunctions'
import { QuestAdapter, QuestOutcome, QuestStatus } from '../QuestTypes'
import { KillQuestRequestSelectors } from './killSelectors'

export const questOnKillListener = (state: GameState, killedCharId: string): void => {
    QuestAdapter.forEach(state.quests, (quest) => {
        if (quest.state !== QuestStatus.ACCEPTED) return

        const auto = QuestData.getEx(quest.templateId).auto

        Object.values(quest.outcomeData.entries).forEach((outcome: QuestOutcome) => {
            if (outcome.location !== state.location) return
            if (!outcome.targets) return

            const targets = outcome.targets

            targets.forEach((target) => {
                if (target.killedCount >= target.targetCount) return
                const templateId = CharacterAdapter.selectEx(state.characters, killedCharId).templateId
                // oxlint-disable-next-line typescript/no-unsafe-enum-comparison
                if (target.targetId !== templateId) return

                target.killedCount = target.killedCount + 1
            })

            if (auto && KillQuestRequestSelectors.isCompleted(quest.id, outcome.id)(state)) {
                completeQuest(state, quest.id, outcome.id)
                return
            }
        })
    })
}
