import { GameState } from '../game/GameState'
import { GameLocations } from '../gameLocations/GameLocations'

export type onItemRemoved = (state: GameState, itemId: string, location: GameLocations) => GameState

export const onItemRemovedListeners: onItemRemoved[] = []
