import { create } from 'zustand'
import { CollapsedEnum } from '../sidebar/CollapsedEnum'

export interface uiTempStore {
    sidebarWidths: Partial<Record<CollapsedEnum, number>>
}
const initialUiTempStore: uiTempStore = {
    sidebarWidths: {},
}
export const useUiTempStore = create<uiTempStore>()(() => initialUiTempStore)
