import { CharItems } from '../characters/templates/charItems'
import { MiningItems } from '../mining/MiningItems'
import { SmithingItems } from '../smithing/SmithingItems'
import { WoodItems } from '../wood/WoodItems'
import { Item } from './Item'

export const StdItems: Record<string, Item> = Object.freeze({
    ...WoodItems,
    ...MiningItems,
    ...SmithingItems,
    ...CharItems,
})
export const StdItemsEntries = Object.values(StdItems)
