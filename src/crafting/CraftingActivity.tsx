import { ReactNode } from 'react'
import { AbstractActivity, ActivityStartResult } from '../activities/AbstractActivity'
import { Translations } from '../msg/Msg'
import { Crafting } from './CraftingIterfaces'
import { CraftingAdapter } from './CraftingAdapter'
import { RecipeResult } from './RecipeInterfaces'
import { Recipe } from './Recipe'
import { Recipes } from './Recipes'
import { GameState } from '../game/GameState'
import { selectItemQta } from '../storage/StorageSelectors'
import { startTimer } from '@/timers/startTimer'
import { TimerTypes } from '../timers/Timer'
import { addItem, saveCraftItem } from '../storage/storageFunctions'
import { StdItems } from '../items/stdItems'
import { GiCube } from 'react-icons/gi'
import { IconsData } from '../icons/Icons'
import { addExp } from '../experience/expFunctions'
import { RecipeData } from './RecipeData'

export class CraftingActivity extends AbstractActivity<Crafting> {
    recipe: Recipe
    constructor(state: GameState, id: string) {
        super(state, id)
        this.recipe = Recipes[this.data.recipeId]
    }
    canCraft(craftResult: RecipeResult): boolean {
        if (craftResult === undefined) return false
        for (const r of craftResult.requirements)
            if (selectItemQta(this.state.location, r.stdItemId, r.craftedItemId)(this.state) < r.qta) return false
        return true
    }
    getData(): Crafting {
        return CraftingAdapter.selectEx(this.state.crafting, this.id)
    }
    onStart(): ActivityStartResult {
        const craftResult = this.recipe.getResult(this.state, this.data.paramsValue)
        if (craftResult === undefined) return ActivityStartResult.NotPossible
        if (!this.canCraft(craftResult)) return ActivityStartResult.NotPossible

        this.state = {
            ...this.state,
            crafting: CraftingAdapter.update(this.state.crafting, this.id, { result: craftResult }),
        }

        this.state = startTimer(this.state, craftResult.time, TimerTypes.Activity, this.id)

        return ActivityStartResult.Started
    }
    onExec(): ActivityStartResult {
        if (this.data.result === undefined) return ActivityStartResult.NotPossible
        const craftResult = this.data.result
        if (!this.canCraft(craftResult)) return ActivityStartResult.NotPossible

        for (const req of craftResult.requirements) {
            if (req.stdItemId) this.state = addItem(this.state, req.stdItemId, null, req.qta * -1)
            if (req.craftedItemId) this.state = addItem(this.state, null, req.craftedItemId, req.qta * -1)
        }

        if (craftResult.results.craftedItem) {
            const { id, state: craftedItems } = saveCraftItem(this.state.craftedItems, craftResult.results.craftedItem)
            this.state = { ...this.state, craftedItems }
            this.state = addItem(this.state, null, id, craftResult.results.qta)
        } else if (craftResult.results.stdItemId) {
            this.state = addItem(this.state, craftResult.results.stdItemId, null, craftResult.results.qta)
        }

        this.state = addExp(this.state, RecipeData[this.recipe.type].expType, 10)

        return ActivityStartResult.Ended
    }
    onRemove() {
        this.state = { ...this.state, crafting: CraftingAdapter.remove(this.state.crafting, this.id) }
    }
    protected getTitleInt(t: Translations): string {
        if (this.data.result.results.stdItemId)
            return t.fun.crafting(StdItems[this.data.result.results.stdItemId].nameId)
        else if (this.data.result.results.craftedItem)
            return t.fun.crafting(this.data.result.results.craftedItem.nameId)
        else return t.t.CraftingUnknown
    }
    getIcon(): ReactNode {
        if (this.data.result.results.stdItemId) return IconsData[StdItems[this.data.result.results.stdItemId].icon]
        else if (this.data.result.results.craftedItem) return IconsData[this.data.result.results.craftedItem.icon]
        else return <GiCube />
    }
}
