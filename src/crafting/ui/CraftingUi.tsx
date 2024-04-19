import { memo, useCallback, useMemo } from 'react'
import { LuHourglass } from 'react-icons/lu'
import { memoize } from '../../utils/memoize'
import { RecipeParamType, RecipeParameter, RecipeTypes } from '../RecipeInterfaces'
import { recipes } from '../Recipes'
import { useGameStore } from '../../game/state'
import {
    canCraft,
    selectCraftTime,
    selectCurrentCrafting,
    selectRecipeId,
    selectRecipeItemValue,
    selectRecipeParams,
    selectRecipeReq,
    selectRecipeResult,
    selectRecipeType,
} from '../CraftingSelectors'
import { useTranslations } from '../../msg/useTranslations'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { selectItemsByTypeCombo } from '../../storage/StorageSelectors'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { GameTimerProgress } from '../../ui/progress/TimerProgress'
import { ExperienceCard } from '../../experience/ui/ExperienceCard'
import { RecipeData } from '../RecipeData'
import { setRecipeItemParam, getRecipeParamId } from '../RecipeFunctions'
import { Recipe } from '../Recipe'
import { MyPage, MyPageAll } from '../../ui/pages/MyPage'
import { removeActivity } from '../../activities/functions/removeActivity'
import { addCrafting } from '../functions/addCrafting'
import { handleRecipeChange } from '../CraftingFunctions'
import { Card, CardContent } from '../../components/ui/card'
import { PLAYER_ID } from '../../characters/charactersConst'
import { ItemSubType } from '../../items/Item'
import { ComboBoxList, ComboBoxResponsive, ComboBoxValue } from '../../components/ui/comboBox'
import { Msg } from '../../msg/Msg'
import { CraftingReq, CraftingResult } from './CraftingResult'
import classes from './craftingUi.module.css'
import { Label } from '@/components/ui/label'

const selectRecipes: (t: RecipeTypes) => { list: Recipe[]; itemSubType: ItemSubType }[] = memoize((t: RecipeTypes) => {
    const ret: { list: Recipe[]; itemSubType: ItemSubType }[] = []
    for (const recipe of recipes.values())
        if (recipe.type === t) {
            let r = ret.find((v) => v.itemSubType === recipe.itemSubType)
            if (!r) {
                r = { list: [], itemSubType: recipe.itemSubType }
                ret.push(r)
            }
            r.list.push(recipe)
        }
    return ret
})
const recipeToCombo = (t: Msg, r: Recipe) => ({ value: r.id, label: t[r.nameId], iconId: r.iconId })

const selectRecipesValues: (t: Msg, recipes: { list: Recipe[]; itemSubType: ItemSubType }[]) => ComboBoxList[] =
    memoize((t: Msg, recipes: { list: Recipe[]; itemSubType: ItemSubType }[]) =>
        recipes.map((e) => {
            return {
                title: e.itemSubType,
                list: e.list.map((v) => recipeToCombo(t, v)),
            }
        })
    )

export const CraftingUi = memo(function CraftingUi() {
    const result = useGameStore(selectRecipeResult)
    const req = useGameStore(selectRecipeReq)
    const recipeType = useGameStore(selectRecipeType)

    if (!recipeType) return
    return (
        <MyPageAll
            header={
                <div className="page__info">
                    <ExperienceCard expType={RecipeData[recipeType].expType} charId={PLAYER_ID} />
                </div>
            }
        >
            <MyPage className="page__main" key={recipeType}>
                <RecipeUi />
                <CraftingResult result={result} />
                <CraftingReq req={req} />
            </MyPage>
        </MyPageAll>
    )
})
const RecipeUi = memo(function RecipeUi() {
    const recipeType = useGameStore(selectRecipeType)
    const params = useGameStore(selectRecipeParams)

    if (!recipeType) return <></>
    return (
        <Card>
            <CardContent>
                <div className={classes.craftingForm}>
                    <RecipeSelectUi />
                    {params.map((rp) => (
                        <RecipeParamUi recipeParam={rp} key={rp.id} />
                    ))}
                    <CraftingButtons />
                </div>
            </CardContent>
        </Card>
    )
})

const RecipeSelectUi = memo(function RecipeSelectUi() {
    const recipeType = useGameStore(selectRecipeType)
    const recipeId = useGameStore(selectRecipeId)
    const { t } = useTranslations()

    if (!recipeType) return
    const recipesByType = selectRecipes(recipeType)
    const selected = recipes.get(recipeId)

    const values = selectRecipesValues(t, recipesByType)
    const selectedRecipeId = selected ? recipeToCombo(t, selected) : null
    const onComboChange = (status: ComboBoxValue | null) => handleRecipeChange(status?.value ?? '')

    return (
        <div>
            <Label>{t.Recipe}</Label>
            <ComboBoxResponsive values={values} selectedValues={selectedRecipeId} setSelectedValue={onComboChange} />
        </div>
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
            <Badge className={classes.timeBadge} variant="secondary">
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
    const itemsId = useGameStore(selectItemsByTypeCombo(recipeParam.itemType))
    const selected = useGameStore(selectRecipeItemValue(recipeParam.id))
    const selectedValue = getRecipeParamId(selected)

    const onComboChange = useCallback(
        (status: ComboBoxValue | null) => setRecipeItemParam(recipeParam.id, status?.value ?? ''),
        [recipeParam.id]
    )

    const values: ComboBoxList[] = useMemo(
        () => [
            {
                title: '',
                list: itemsId,
            },
        ],
        [itemsId]
    )

    const selectedRecipeId: ComboBoxValue | null = itemsId.find((v) => v.value === selectedValue) ?? null

    return (
        <div>
            <Label>{t[recipeParam.nameId]}</Label>
            <ComboBoxResponsive values={values} selectedValues={selectedRecipeId} setSelectedValue={onComboChange} />
        </div>
    )
})
