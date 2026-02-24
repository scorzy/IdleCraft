import { GameState } from '../game/GameState'
import { GameLocations } from '../gameLocations/GameLocations'

export type onItemRemoved = (state: GameState, itemId: string, location: GameLocations, quantity: number) => void

export const onItemRemovedListeners: onItemRemoved[] = []
