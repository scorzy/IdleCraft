import { useGameStore } from '../../game/state'
import { OreTypes } from '../OreTypes'
import { makeMining } from './makeMining'

export const addMining = (oreType: OreTypes) => useGameStore.setState((s) => makeMining(oreType)(s))
