import { loadData } from '../loadData'
import { useGameStore } from '../state'
import { loadGame } from './loadGame'

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type

export const load = (data: object) => {
    let state = loadData(data)
    state = loadGame(state)
    useGameStore.setState(state)
}
