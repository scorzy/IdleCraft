import { setState } from '../../game/setState'
import { makeMiningVeinSearch } from './makeMiningVeinSearch'

export const addMiningVeinSearch = () => setState((s) => makeMiningVeinSearch(s))
