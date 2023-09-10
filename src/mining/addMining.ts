import { useGameStore } from '../game/state'
import { MiningActivityCreator } from './MiningActivity'
import { OreTypes } from './OreTypes'

export const addMining = (oreType: OreTypes) =>
    useGameStore.setState((s) => {
        return new MiningActivityCreator(s, oreType).createActivity()
    })
