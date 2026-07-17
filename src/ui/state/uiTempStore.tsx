import { create } from 'zustand'
import { GameLocations } from '../../gameLocations/GameLocations'
import { CollapsedEnum } from '../sidebar/CollapsedEnum'

export interface TravellingState {
    location: GameLocations
    start: number
    end: number
}

export interface UiTempStore {
    sidebarWidths: Partial<Record<CollapsedEnum, number>>
    loadingData?: {
        loading: boolean
        start: number
        now: number
        end: number
        percent: number
    }
    travelling?: TravellingState
}
const initialUiTempStore: UiTempStore = {
    sidebarWidths: {},
}
export const useUiTempStore = create<UiTempStore>()(() => initialUiTempStore)
