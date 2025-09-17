import { create } from 'zustand'
import { CollapsedEnum } from '../sidebar/CollapsedEnum'

export interface UiTempStore {
    sidebarWidths: Partial<Record<CollapsedEnum, number>>
    loadingData?: {
        loading: boolean
        start: number
        now: number
        end: number
        percent: number
    }
}
const initialUiTempStore: UiTempStore = {
    sidebarWidths: {},
}
export const useUiTempStore = create<UiTempStore>()(() => initialUiTempStore)
