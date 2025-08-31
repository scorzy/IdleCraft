import { ItemFilter } from '../items/Item'

export interface ItemRequest {
    id: string
    itemCount: number
    itemFilter: ItemFilter
    selectedItems: string[]
}
