import { ActivityState } from './ActivityState'

export interface Activities {
    activities: { [k in string]?: ActivityState }
}
