import { setState } from '../../game/setState'
import { OreTypes } from '../OreTypes'
import { makeMining } from './makeMining'

export const addMining = (oreType: OreTypes) => setState((s) => makeMining(oreType)(s))
