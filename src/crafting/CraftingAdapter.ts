import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'
import { Crafting } from './CraftingIterfaces'

class CraftingAdapterInt extends AbstractEntityAdapter<Crafting> {
    getId(data: Crafting): string {
        return data.activityId
    }
}
export const CraftingAdapter = new CraftingAdapterInt()
