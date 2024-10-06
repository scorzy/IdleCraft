import { loadData } from '../loadData'
import { useGameStore } from '../state'
import { loadGame } from './loadGame'

export const load = (data: object) => {
    let state = loadData(data)
    state = loadGame(state)
    useGameStore.setState(state)
}
