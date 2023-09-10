import { memoize } from '../utils/memoize'
import { OreData } from './OreData'
import { OreState } from './OreState'
import { OreTypes } from './OreTypes'

export const getMiningTime = (): number => 2e3
export const getSearchMineTime = (): number => 5e3
export const getMiningDamage = () => 25

export const selectDefaultMine = memoize(function selectDefaultMine(oreType: OreTypes): OreState {
    const data = OreData[oreType]
    return {
        hp: data.hp,
        qta: data.qta,
    }
})
