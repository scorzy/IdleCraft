import { createEntityAdapter } from '../entityAdapter/entityAdapter'

export enum ActivityTypes {
    Woodcutting = 'Woodcutting',
}
export interface ActivityState {
    id: string
    type: ActivityTypes
    max: number
}
export const ActivityAdapter = createEntityAdapter<ActivityState>({ getId: (a: ActivityState) => a.id })
