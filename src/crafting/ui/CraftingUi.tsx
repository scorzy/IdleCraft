import { memo, useCallback } from 'react'
import { LuHourglass } from 'react-icons/lu'
import { MyCard } from '../../ui/myCard/myCard'
import { memoize } from '../../utils/memoize'
import { RecipeParamType, RecipeParameter, RecipeTypes } from '../RecipeInterfaces'
import { recipes } from '../Recipes'
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
import { addCrafting } from '../CraftingFunctions'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { IconsData } from '../../icons/Icons'
import { selectItemsByType, selectGameItem, selectItemQta } from '../../storage/StorageSelectors'
import { ItemId } from '../../storage/storageState'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { GameTimerProgress } from '../../ui/progress/TimerProgress'
import { removeActivity } from '../../activities/activityFunctions'
import { ExperienceCard } from '../../experience/ui/ExperienceCard'
import { RecipeData } from '../RecipeData'
import { changeRecipe, setRecipeItemParam, getRecipeParamId } from '../RecipeFunctions'
import { Recipe } from '../Recipe'
import { MyPage } from '../../ui/pages/MyPage'
import { CraftingReq, CraftingResult } from './CraftingResult'
import classes from './craftingUi.module.css'
import { FormItem } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const selectRecipes: (t: RecipeTypes) => Recipe[] = memoize((t: RecipeTypes) => {
    const ret: Recipe[] = []
    for (const recipe of recipes.values()) if (recipe.type === t) ret.push(recipe)

    return ret
})

export const CraftingUi = memo(function CraftingUi() {
    const result = useGameStore(selectRecipeResult)
    const req = useGameStore(selectRecipeReq)
    const recipeType = useGameStore(selectRecipeType)

    if (!recipeType) return <></>
    return (
        <MyPage>
            <div className="page__info">
                <ExperienceCard expType={RecipeData[recipeType].expType} />
            </div>
            <div className="page__main" key={recipeType}>
                <RecipeUi />
                <CraftingResult result={result} />
                <CraftingReq req={req} />
            </div>
        </MyPage>
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

    const id = useGameStore(selectCurrentCrafting)
    const bntEnabled = useGameStore(canCraft)
    const onClickRemove = useCallback(() => removeActivity(id), [id])

    return (
        <>
            <Badge className={classes.timeBadge} variant={bntEnabled ? 'default' : 'secondary'}>
                <LuHourglass />
                {time ? ft(time) : '-'}
            </Badge>
            {id === null && (
                <Button type="submit" className="w-min" onClick={addCrafting} disabled={!bntEnabled}>
                    {t.Craft}
                </Button>
            )}
            {id !== null && (
                <Button type="submit" className="w-min" variant="destructive" onClick={onClickRemove}>
                    {t.Remove}
                </Button>
            )}
            <GameTimerProgress actionId={id} color="primary" />
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
                    {/* <SelectItem value="">{t.None}</SelectItem> */}
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
                    <SelectValue placeholder={`-- ${t[recipeParam.nameId]} --`} />
                </SelectTrigger>
                <SelectContent>
                    {/* <SelectItem value="">{t.None}</SelectItem> */}
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
    const itemObj = useGameStore(selectGameItem(itemId.stdItemId ?? null, itemId.craftItemId ?? null))
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    const qta = useGameStore(selectItemQta(null, itemId.stdItemId ?? null, itemId.craftItemId ?? null))
    const text = itemObj ? t[itemObj.nameId] : t.None

    return (
        <SelectItem value={value} icon={itemObj && IconsData[itemObj.icon]} className={classes.seleBtn}>
            <span className={classes.item}>
                <span className={classes.text}>{text}</span>
                <span className="text-muted-foreground">{f(qta)}</span>
            </span>
        </SelectItem>
    )
})
