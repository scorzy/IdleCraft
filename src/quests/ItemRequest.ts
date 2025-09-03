import { ItemFilter } from '../items/Item'

export interface ItemRequest {
    id: string
    itemCount: number
    itemFilter: ItemFilter
    selectedItems1?: string
    selectedItems2?: string
    selectedItems3?: string
}
