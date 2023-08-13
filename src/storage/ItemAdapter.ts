import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'
import { Item } from '../items/Item'

export class ItemAdapterInt extends AbstractEntityAdapter<Item> {
    getId(data: Item): string {
        return data.id
    }
}
export const ItemAdapter = new ItemAdapterInt()
