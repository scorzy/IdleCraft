import { GameState } from '../game/GameState'
import { useGameStore } from '../game/state'

export const selectQuest = (id: string) =>
    useGameStore.setState((state: GameState) => {
        return {
            ...state,
            quests: {
                ...state.quests,
                selectedQuestId: id,
            },
        }
    })
