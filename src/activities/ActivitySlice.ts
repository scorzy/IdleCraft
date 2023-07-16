import { StateCreator } from 'zustand'
import { ActivityState } from './ActivityState'

export interface Activities {
    activities: { [k: string]: ActivityState }
}
export const createActivitySlice: StateCreator<Activities, [], [], Activities> = (set) => ({
    activities: {},
})
