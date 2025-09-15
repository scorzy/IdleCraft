import { setState } from '../../game/setState'

export const closeDeadDialog = () =>
    setState((s) => {
        s.ui.deadDialog = false
    })
