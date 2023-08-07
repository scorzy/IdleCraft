import { WoodItems } from '../wood/WoodItems'
import { Item } from './Item'

export const StdItems = { ...WoodItems } satisfies { [k: string]: Item }

export const StdItemsEntries = Object.values(StdItems)
