import { CharacterAdapter } from '../../characters/characterAdapter'
import { GameState } from '../../game/GameState'
import { KillQuestTarget } from '../KillQuestTarget'
import { QuestAdapter, QuestStatus, QuestOutcome, QuestOutcomeAdapter } from '../QuestTypes'

export const questOnKillListener = (state: GameState, killedCharId: string): GameState => {
    QuestAdapter.forEach(state.quests, (quest) => {
        if (quest.state !== QuestStatus.ACCEPTED) return

        Object.values(quest.outcomeData.entries).forEach((outcome: QuestOutcome) => {
            if (outcome.location !== state.location) return
            if (!outcome.targets) return

            let targets = outcome.targets

            const getIndex = (t: KillQuestTarget[]) =>
                t.findIndex((target) => {
                    if (target.killedCount >= target.targetCount) return false
                    const templateId = CharacterAdapter.selectEx(state.characters, killedCharId).templateId
                    if (target.targetId !== templateId) return false
                    return true
                })

            let index = getIndex(targets)

            let n = 0
            while (index > -1 && n < 1e3) {
                n++
                const target = targets[index]
                if (target) {
                    if (target.killedCount >= target.targetCount) continue
                    const templateId = CharacterAdapter.selectEx(state.characters, killedCharId).templateId
                    if (target.targetId !== templateId) return

                    const newTarget = { ...target, killedCount: target.killedCount + 1 }

                    targets = targets.with(index, newTarget)
                }
                index = getIndex(targets)
            }

            if (targets === outcome.targets) return

            state = {
                ...state,
                quests: QuestAdapter.update(state.quests, quest.id, {
                    outcomeData: QuestOutcomeAdapter.update(quest.outcomeData, outcome.id, { targets }),
                }),
            }
        })
    })

    return state
}
