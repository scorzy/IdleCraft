import { setState } from '../../game/state'

export const closeDeadDialog = () =>
    setState((s) => {
        s.ui.deadDialog = false
    })
