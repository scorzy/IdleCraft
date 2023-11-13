import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'
import { Item } from '../items/Item'

export class ItemAdapterInt extends AbstractEntityAdapter<Item> {
    getId(data: Item): string {
        return data.id
    }
    complete(data: unknown): Item | null {
        if (!data) return null
        if (typeof data !== 'object') return null
        if (!('id' in data)) return null

        return data as Item
    }
}
export const ItemAdapter = new ItemAdapterInt()
