import { WoodItems } from '../wood/WoodItems'
import { Item } from './Item'

export const StdItems: { [k: string]: Item } = { ...WoodItems }
export const StdItemsEntries = Object.values(StdItems)
