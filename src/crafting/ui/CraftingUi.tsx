import { memo } from 'react'
import { MyCard } from '../../ui/myCard/myCard'
import { Page } from '../../ui/shell/AppShell'
import { memoize } from '../../utils/memoize'
import { RecipeParamType, RecipeParameter, RecipeTypes } from '../Recipe'
import { Recipes } from '../Recipes'
import { useGameStore } from '../../game/state'
import { selectRecipeItemValue, selectRecipeParams, selectRecipeReq, selectRecipeResult } from '../CraftingSelectors'
import { useTranslations } from '../../msg/useTranslations'
import classes from './craftingUi.module.css'
import { CraftingReq, CraftingResult } from './CraftingResult'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { changeRecipe, getRecipeParamId, setRecipeItemParam } from '../CraftingFunctions'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { IconsData } from '../../icons/Icons'
import { selectItemsByType, selectItem, selectItemQta } from '../../storage/StorageSelectors'
import { ItemId } from '../../storage/storageState'

const selectRecipes = memoize((t: RecipeTypes) => Object.values(Recipes).filter((r) => r.type === t))

export const CraftingUi = memo(function CraftingUi() {
    const result = useGameStore(selectRecipeResult)
    const req = useGameStore(selectRecipeReq)

    return (
        <Page>
            <div className="my-container my-container-3">
                <RecipeUi />
                <CraftingResult result={result} />
                <CraftingReq req={req} />
            </div>
        </Page>
    )
})
const RecipeUi = memo(function RecipeUi() {
    const recipeType = useGameStore((s) => s.ui.recipeType)
    const params = useGameStore(selectRecipeParams)

    if (!recipeType) return <></>
    return (
        <MyCard>
            <form className={classes.craftingForm}>
                <RecipeSelectUi />
                {params.map((rp) => (
                    <RecipeParamUi recipeParam={rp} key={rp.id} />
                ))}
            </form>
        </MyCard>
    )
})

const RecipeSelectUi = memo(function RecipeSelectUi() {
    const recipeType = useGameStore((s) => s.ui.recipeType)
    const recipeId = useGameStore((s) => s.recipeId)
    const { t } = useTranslations()
    const handleRecipeChange = (value: string) => changeRecipe(value)

    if (!recipeType) return <></>
    const recipes = selectRecipes(recipeType)

    return (
        <div>
            <label id="recipe-label-Id">{t.Recipe}</label>
            <Select value={recipeId} onValueChange={handleRecipeChange}>
                <SelectTrigger>
                    <SelectValue placeholder="select a recipe" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="">{t.None}</SelectItem>
                    {recipes.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                            {t[r.nameId]}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
})

const RecipeParamUi = memo(function RecipeParamUi(props: { recipeParam: RecipeParameter }) {
    const { recipeParam } = props

    switch (recipeParam.type) {
        case RecipeParamType.ItemType:
            return <RecipeParamItemType recipeParam={recipeParam} />
    }
})

const RecipeParamItemType = memo(function RecipeParamItemType(props: { recipeParam: RecipeParameter }) {
    const { recipeParam } = props
    const { t } = useTranslations()
    const itemsId = useGameStore(selectItemsByType(recipeParam.itemType))
    const selected = useGameStore(selectRecipeItemValue(recipeParam.id))
    const handleRecipeChange = (value: string) => setRecipeItemParam(recipeParam.id, value)
    const selectedValue = getRecipeParamId(selected)
    return (
        <div>
            <label id={`${recipeParam.id}-label`}>{t[recipeParam.nameId]}</label>
            <Select value={selectedValue} onValueChange={handleRecipeChange}>
                <SelectTrigger>
                    <SelectValue placeholder="select a recipe" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="">{t.None}</SelectItem>
                    {itemsId.map((t) => {
                        const value = getRecipeParamId(t)
                        return <ParamItem itemId={t} key={value} />
                    })}
                </SelectContent>
            </Select>
        </div>
    )
})
const ParamItem = memo(function ParamItem(props: { itemId: ItemId }) {
    const { itemId } = props
    const value = getRecipeParamId(itemId)
    const itemObj = useGameStore(selectItem(itemId?.stdItemId ?? null, itemId?.craftItemId ?? null))
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    const qta = useGameStore(selectItemQta(null, itemId?.stdItemId ?? null, itemId?.craftItemId ?? null))
    const text = itemObj ? t[itemObj.nameId] : t.None

    return (
        <SelectItem value={value} icon={itemObj && IconsData[itemObj.icon]}>
            {text} <span className="monospace">{f(qta)}</span>
        </SelectItem>
    )
})
