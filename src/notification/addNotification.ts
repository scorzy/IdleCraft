import { GameState } from '../game/GameState'
import { MyToast } from './MyToast'

export function addNotification(state: GameState, notification: MyToast): GameState {
    return { ...state, notifications: [...state.notifications, notification] }
}
