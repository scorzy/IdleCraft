import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'
import { Item } from '../items/Item'
import { loadItem } from '../items/itemFunctions'

export class ItemAdapterInt extends AbstractEntityAdapter<Item> {
    getId(data: Item): string {
        return data.id
    }
    complete(data: unknown): Item | null {
        return loadItem(data)
    }
}
export const ItemAdapter = new ItemAdapterInt()
