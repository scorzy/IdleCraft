import { setState } from '../../game/setState'
import { OreTypes } from '../OreTypes'
import { makeMiningVeinSearch } from './makeMiningVeinSearch'

export const addMiningVeinSearch = (oreType: OreTypes) => setState((s) => makeMiningVeinSearch(oreType)(s))
