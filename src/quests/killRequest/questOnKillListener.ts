import { CharacterAdapter } from '../../characters/characterAdapter'
import { GameState } from '../../game/GameState'
import { QuestAdapter, QuestStatus, QuestOutcome } from '../QuestTypes'

export const questOnKillListener = (state: GameState, killedCharId: string): void => {
    QuestAdapter.forEach(state.quests, (quest) => {
        if (quest.state !== QuestStatus.ACCEPTED) return

        Object.values(quest.outcomeData.entries).forEach((outcome: QuestOutcome) => {
            if (outcome.location !== state.location) return
            if (!outcome.targets) return

            const targets = outcome.targets

            targets.forEach((target) => {
                if (target.killedCount >= target.targetCount) return
                const templateId = CharacterAdapter.selectEx(state.characters, killedCharId).templateId
                if (target.targetId !== templateId) return

                target.killedCount = target.killedCount + 1
            })
        })
    })
}
