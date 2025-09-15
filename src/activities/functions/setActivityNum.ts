import { setState } from '../../game/setState'
import { ActivityAdapter } from '../ActivityState'

export const setActivityNum = (id: string, max: number) =>
    setState((state) => {
        ActivityAdapter.update(state.activities, id, { max })
    })
