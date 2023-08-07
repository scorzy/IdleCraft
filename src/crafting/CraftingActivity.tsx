import { ReactNode } from 'react'
import { AbstractActivity, ActivityStartResult } from '../activities/AbstractActivity'
import { Translations } from '../msg/Msg'
import { Crafting } from './CraftingIterfaces'
import { CraftingAdapter } from './CraftingAdapter'
import { Recipe, RecipeResult } from './Recipe'
import { Recipes } from './Recipes'
import { GameState } from '../game/GameState'
import { selectItemQta } from '../storage/StorageSelectors'
import { startTimer } from '../timers/timerFunctions'
import { TimerTypes } from '../timers/Timer'
import { addItem, saveCraftItem } from '../storage/storageFunctions'
import { StdItems } from '../items/stdItems'
import { GiCube } from 'react-icons/gi'

export class CraftingActivity extends AbstractActivity<Crafting> {
    recipe: Recipe
    craftResult: RecipeResult | undefined
    constructor(state: GameState, id: string) {
        super(state, id)
        this.recipe = Recipes[this.data.recipeId]
    }
    canCraft(): boolean {
        if (this.craftResult === undefined) return false
        for (const r of this.craftResult.requirements)
            if (selectItemQta(this.state.location, r.stdItem, r.craftedItem)(this.state) < r.qta) return false
        return true
    }
    getData(): Crafting {
        return CraftingAdapter.selectEx(this.state.crafting, this.id)
    }
    onStart(): ActivityStartResult {
        this.craftResult = this.recipe.getResult(this.state, this.data.params)
        if (this.craftResult === undefined) return ActivityStartResult.NotPossible
        if (!this.canCraft()) return ActivityStartResult.NotPossible

        this.state = {
            ...this.state,
            crafting: CraftingAdapter.update(this.state.crafting, this.id, { result: this.craftResult }),
        }

        this.state = startTimer(this.state, this.craftResult.time, TimerTypes.Activity, this.id)

        return ActivityStartResult.Started
    }
    onExec(): ActivityStartResult {
        if (this.data.result === undefined) return ActivityStartResult.NotPossible
        this.craftResult = this.data.result
        if (!this.canCraft()) return ActivityStartResult.NotPossible

        if (this.craftResult.results.craftedItem) {
            const { id, state: craftedItems } = saveCraftItem(
                this.state.craftedItems,
                this.craftResult.results.craftedItem
            )
            this.state = { ...this.state, craftedItems }
            this.state = addItem(this.state, null, id, this.craftResult.results.qta)
        } else if (this.craftResult.results.stdItem) {
            this.state = addItem(this.state, this.craftResult.results.stdItem, null, this.craftResult.results.qta)
        }

        return ActivityStartResult.Ended
    }
    onRemove() {
        this.state = { ...this.state, crafting: CraftingAdapter.remove(this.state.crafting, this.id) }
    }
    protected getTitleInt(t: Translations): string {
        if (this.data.result.results.stdItem) return t.fun.crafting(StdItems[this.data.result.results.stdItem].nameId)
        else if (this.data.result.results.craftedItem)
            return t.fun.crafting(this.data.result.results.craftedItem.nameId)
        else return t.t.CraftingUnknown
    }
    getIcon(): ReactNode {
        if (this.data.result.results.stdItem) return StdItems[this.data.result.results.stdItem].icon
        else if (this.data.result.results.craftedItem) return this.data.result.results.craftedItem.icon
        else return <GiCube />
    }
}
