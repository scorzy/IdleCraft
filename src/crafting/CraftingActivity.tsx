import { ReactNode } from 'react'
import { GiCube } from 'react-icons/gi'
import { AbstractActivity, ActivityStartResult } from '../activities/AbstractActivity'
import { Translations } from '../msg/Msg'
import { GameState } from '../game/GameState'
import { selectItemQta } from '../storage/StorageSelectors'
import { TimerTypes } from '../timers/Timer'
import { addItem, saveCraftItem } from '../storage/storageFunctions'
import { StdItems } from '../items/stdItems'
import { IconsData } from '../icons/Icons'
import { addExp } from '../experience/expFunctions'
import { startTimer } from '../timers/startTimer'
import { RecipeData } from './RecipeData'
import { Recipes } from './Recipes'
import { Recipe } from './Recipe'
import { RecipeResult } from './RecipeInterfaces'
import { CraftingAdapter } from './CraftingAdapter'
import { Crafting } from './CraftingIterfaces'

export class CraftingActivity extends AbstractActivity<Crafting> {
    recipe: Recipe
    constructor(state: GameState, id: string) {
        super(state, id)
        const recipe = Recipes[this.data.recipeId]
        if (!recipe) throw new Error(`Recipe ${this.data.recipeId} not found`)
        this.recipe = recipe
    }
    canCraft(craftResult?: RecipeResult): boolean {
        if (!craftResult) return false
        for (const r of craftResult.requirements)
            if (selectItemQta(this.state.location, r.stdItemId, r.craftedItemId)(this.state) < r.qta) return false
        return true
    }
    getData(): Crafting {
        return CraftingAdapter.selectEx(this.state.crafting, this.id)
    }
    onStart(): ActivityStartResult {
        const craftResult = this.recipe.getResult(this.state, this.data.paramsValue)
        if (!craftResult) return ActivityStartResult.NotPossible
        if (!this.canCraft(craftResult)) return ActivityStartResult.NotPossible

        this.state = {
            ...this.state,
            crafting: CraftingAdapter.update(this.state.crafting, this.id, { result: craftResult }),
        }

        this.state = startTimer(this.state, craftResult.time, TimerTypes.Activity, this.id)

        return ActivityStartResult.Started
    }
    onExec(): ActivityStartResult {
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
        if (this.data.result.results.stdItemId) {
            const stdItem = StdItems[this.data.result.results.stdItemId]
            if (!stdItem) throw new Error(`StdItem not found ${this.data.result.results.stdItemId}`)
            return t.fun.crafting(stdItem.nameId)
        } else if (this.data.result.results.craftedItem)
            return t.fun.crafting(this.data.result.results.craftedItem.nameId)
        else return t.t.CraftingUnknown
    }
    getIcon(): ReactNode {
        if (this.data.result.results.stdItemId) {
            const stdItem = StdItems[this.data.result.results.stdItemId]
            if (!stdItem) throw new Error(`StdItem not found ${this.data.result.results.stdItemId}`)
            return IconsData[stdItem.icon]
        } else if (this.data.result.results.craftedItem) return IconsData[this.data.result.results.craftedItem.icon]
        else return <GiCube />
    }
}
