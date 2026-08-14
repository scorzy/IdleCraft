import { GameState } from '../game/GameState'
import { GameLocations } from '../gameLocations/GameLocations'

export type onItemRemoved = (state: GameState, itemId: string, location: GameLocations) => void

export const onItemRemovedListeners: onItemRemoved[] = []

export type onItemDecreased = (state: GameState, itemId: string, location: GameLocations, newQuantity: number) => void

export const onItemDecreasedListeners: onItemDecreased[] = []
