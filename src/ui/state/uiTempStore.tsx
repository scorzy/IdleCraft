import { create } from 'zustand'
import { CollapsedEnum } from '../sidebar/CollapsedEnum'

export interface uiTempStore {
    sidebarWidths: {
        [K in CollapsedEnum]?: number
    }
}
const initialUiTempStore: uiTempStore = {
    sidebarWidths: {},
}
export const useUiTempStore = create<uiTempStore>()(() => initialUiTempStore)
