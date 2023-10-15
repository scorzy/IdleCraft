import { MiningItems } from '../mining/MiningItems'
import { SmithingItems } from '../smithing/SmithingItems'
import { WoodItems } from '../wood/WoodItems'
import { Item } from './Item'

export const StdItems: { [k: string]: Item } = Object.freeze({ ...WoodItems, ...MiningItems, ...SmithingItems })
export const StdItemsEntries = Object.values(StdItems)
