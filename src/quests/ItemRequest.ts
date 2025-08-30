import { ItemFilter } from '../items/Item'

export interface ItemRequest {
    itemCount: number
    itemFilter: ItemFilter
    selectedItems: string[]
}
