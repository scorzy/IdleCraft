import { AlchemyItems } from '../alchemy/alchemyItems'
import { ButcheringItems } from '../butchering/ButcheringItems'
import { getCharacterItems } from '../characters/templates/characterRegistry'
import { MiningItems } from '../mining/MiningItems'
import { SmithingItems } from '../smithing/SmithingItems'
import { WoodItems } from '../wood/WoodItems'
import { Item } from './Item'

export const StdItems: Record<string, Item> = {
    ...WoodItems,
    ...MiningItems,
    ...SmithingItems,
    ...ButcheringItems,
    ...AlchemyItems,
}

export function initCharacterStdItems(): void {
    for (const item of getCharacterItems()) {
        const current = StdItems[item.id]
        if (current && JSON.stringify(current) !== JSON.stringify(item)) {
            throw new Error(`Conflicting standard item definition: ${item.id}`)
        }
        StdItems[item.id] = item
    }
}

export function getStdItemsEntries(): Item[] {
    return Object.values(StdItems)
}

export function getUnlimitedItems(): Item[] {
    return getStdItemsEntries().filter((item) => item.unlimited)
}
