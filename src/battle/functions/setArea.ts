import { setState } from '../../game/setState'

export const setArea = (battleZone: string) =>
    setState((s) => {
        s.ui.battleZone = battleZone
    })
