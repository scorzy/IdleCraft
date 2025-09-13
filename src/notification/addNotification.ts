import { MyToast } from './MyToast'
import { ToastState } from './toastState'

export function addNotification(state: ToastState, notification: MyToast) {
    state.push(notification)
}
