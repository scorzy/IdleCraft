import { ItemFilter } from '../items/Item'

export interface ItemRequest {
    id: string
    itemCount: number
    itemFilter: ItemFilter
    selectedItem1?: string
    selectedItem2?: string
    selectedItem3?: string
}
