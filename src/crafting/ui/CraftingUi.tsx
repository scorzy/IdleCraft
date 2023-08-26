import { memo } from 'react'
import { MyCard } from '../../ui/myCard/myCard'
import { Page } from '../../ui/shell/AppShell'
import { memoize } from '../../utils/memoize'
import { RecipeParamType, RecipeParameter, RecipeTypes } from '../RecipeInterfaces'
import { Recipes } from '../Recipes'
import { useGameStore } from '../../game/state'
import {
    canCraft,
    selectCraftTime,
    selectCurrentCrafting,
    selectRecipeItemValue,
    selectRecipeParams,
    selectRecipeReq,
    selectRecipeResult,
    selectRecipeType,
} from '../CraftingSelectors'
import { useTranslations } from '../../msg/useTranslations'
import classes from './craftingUi.module.css'
import { CraftingReq, CraftingResult } from './CraftingResult'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { addCrafting, changeRecipe, getRecipeParamId, setRecipeItemParam } from '../CraftingFunctions'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { IconsData } from '../../icons/Icons'
import { selectItemsByType, selectItem, selectItemQta } from '../../storage/StorageSelectors'
import { ItemId } from '../../storage/storageState'
import { Label } from '@/components/ui/label'
import { FormItem } from '@/components/ui/form'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { LuHourglass } from 'react-icons/lu'
import { GameTimerProgress } from '../../ui/progress/TimerProgress'

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
    const recipeType = useGameStore(selectRecipeType)
    const params = useGameStore(selectRecipeParams)

    if (!recipeType) return <></>
    return (
        <MyCard>
            <div className={classes.craftingForm}>
                <RecipeSelectUi />
                {params.map((rp) => (
                    <RecipeParamUi recipeParam={rp} key={rp.id} />
                ))}
                <CraftingButtons />
            </div>
        </MyCard>
    )
})

const CraftingButtons = memo(function CraftingButtons() {
    const { ft } = useNumberFormatter()
    const { t } = useTranslations()
    const time = useGameStore(selectCraftTime)

    const isCrafting = useGameStore(selectCurrentCrafting)
    const bntEnabled = useGameStore(canCraft)

    return (
        <>
            <Badge className={classes.timeBadge} variant={bntEnabled ? 'default' : 'secondary'}>
                <LuHourglass />
                {time ? ft(time) : '-'}
            </Badge>
            <Button type="submit" className="w-min" onClick={addCrafting} disabled={!bntEnabled || isCrafting !== null}>
                {t.Craft}
            </Button>
            <GameTimerProgress actionId={isCrafting} color="primary" />
        </>
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
        <FormItem>
            <Label>{t.Recipe}</Label>
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
        </FormItem>
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
        <FormItem>
            <Label>{t[recipeParam.nameId]}</Label>
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
        </FormItem>
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
            {text} {f(qta)}
        </SelectItem>
    )
})
