import { useGameStore } from '../../game/state'
import { ActivityAdapter } from '../ActivityState'

export const setActivityNum = (id: string, max: number) =>
    useGameStore.setState((state) => {
        state = { ...state, activities: ActivityAdapter.update(state.activities, id, { max }) }
        return state
    })
