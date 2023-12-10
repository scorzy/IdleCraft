import { AbstractActivityCreator } from '../activities/AbstractActivityCreator'
import { ActivityTypes } from '../activities/ActivityState'
import { Crafting } from './CraftingIterfaces'
import { CraftingAdapter } from './CraftingAdapter'

export class CraftingActivityCreator extends AbstractActivityCreator<null> {
    protected type = ActivityTypes.Crafting
    protected onAdd(): void {
        if (!this.state.craftingForm.result) return

        const data: Crafting = {
            activityId: this.id,
            recipeId: this.state.recipeId,
            paramsValue: this.state.craftingForm.paramsValue,
            result: this.state.craftingForm.result,
        }

        this.state = { ...this.state, crafting: CraftingAdapter.create(this.state.crafting, data) }
    }
}
