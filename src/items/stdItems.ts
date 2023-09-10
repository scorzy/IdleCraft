import { MiningItems } from '../mining/MiningItems'
import { WoodItems } from '../wood/WoodItems'
import { Item } from './Item'

export const StdItems: { [k: string]: Item } = { ...WoodItems, ...MiningItems }
export const StdItemsEntries = Object.values(StdItems)
