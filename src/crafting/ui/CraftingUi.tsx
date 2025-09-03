import { memo, useCallback } from 'react'
import { LuHourglass } from 'react-icons/lu'
import { myMemoize } from '../../utils/myMemoize'
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
import { selectGameItem, selectItemQta, selectItemsByType } from '../../storage/StorageSelectors'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { GameTimerProgress } from '../../ui/progress/TimerProgress'
import { ExperienceCard } from '../../experience/ui/ExperienceCard'
import { RecipeData } from '../RecipeData'
import { setRecipeItemParamUi } from '../RecipeFunctions'
import { Recipe } from '../Recipe'
import { MyPage } from '../../ui/pages/MyPage'
import { removeActivity } from '../../activities/functions/removeActivity'
import { addCraftingClick } from '../functions/addCrafting'
import { handleRecipeChange } from '../CraftingFunctions'
import { Card, CardContent } from '../../components/ui/card'
import { PLAYER_ID } from '../../characters/charactersConst'
import { IconsData } from '../../icons/Icons'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { GameState } from '../../game/GameState'
import { CraftingReq, CraftingResult } from './CraftingResult'
import classes from './craftingUi.module.css'
import { Label } from '@/components/ui/label'

const selectRecipes: (t: RecipeTypes) => Recipe[] = myMemoize((t: RecipeTypes) => {
    const ret: Recipe[] = []
    const recipeValues = recipes.values()
    for (const recipe of recipeValues) if (recipe.type === t) ret.push(recipe)
    return ret
})

export const CraftingUi = memo(function CraftingUi() {
    const result = useGameStore(selectRecipeResult)
    const req = useGameStore(selectRecipeReq)
    const recipeType = useGameStore(selectRecipeType)
    const { t } = useTranslations()

    if (!recipeType) return

    return (
        <MyPage className="page__main" key={recipeType}>
            <RecipeUi />

            <Card>
                <MyCardHeaderTitle title={t.Results} />
                <CardContent>{result && result?.map((r) => <CraftingResult key={r.id} result={r} />)}</CardContent>
            </Card>

            <Card>
                <MyCardHeaderTitle title={t.Requirements} />
                <CardContent>
                    <CraftingReq req={req} />
                </CardContent>
            </Card>

            <ExperienceCard expType={RecipeData[recipeType].expType} charId={PLAYER_ID} />
        </MyPage>
    )
})
const RecipeUi = memo(function RecipeUi() {
    const recipeType = useGameStore(selectRecipeType)
    const params = useGameStore(selectRecipeParams)
    const { t } = useTranslations()

    if (!recipeType) return null
    return (
        <Card>
            <MyCardHeaderTitle title={t.Recipe} />
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
    const icon = selected && IconsData[selected.iconId]

    return (
        <Select value={recipeId ?? ''} onValueChange={handleRecipeChange}>
            <SelectTrigger>
                <SelectValue placeholder={t.SelectARecipe}>
                    {selected && (
                        <span className="select-trigger">
                            {icon} {t[selected.nameId]}
                        </span>
                    )}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {recipesByType.map((r) => (
                    <SelectItem key={r.id} value={r.id} icon={IconsData[r.iconId]}>
                        {t[r.nameId]}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
})

const CraftingButtons = memo(function CraftingButtons() {
    const { t, fun } = useTranslations()
    const time = useGameStore(selectCraftTime)

    const id = useGameStore(selectCurrentCrafting)
    const bntEnabled = useGameStore(canCraft)
    const onClickRemove = useCallback(() => removeActivity(id), [id])

    return (
        <>
            <Badge className={classes.timeBadge} variant="secondary">
                <LuHourglass />
                {time ? fun.formatTime(time) : '-'}
            </Badge>
            {id === null && (
                <Button type="submit" className="w-min" onClick={addCraftingClick} disabled={!bntEnabled}>
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
    const itemsId = useGameStore(selectItemsByType(recipeParam.itemType))
    const selected = useGameStore(selectRecipeItemValue(recipeParam.id))
    const selectedValue = selected?.itemId
    const selectedItem = useGameStore((s: GameState) => {
        if (!selected) return null
        return selectGameItem(selected.id)(s)
    })

    const handleRecipeChange = useCallback(
        (value: string) => setRecipeItemParamUi(recipeParam.id, value),
        [recipeParam.id]
    )

    return (
        <div>
            <Label>{t[recipeParam.nameId]}</Label>
            <Select value={selectedValue ?? ''} onValueChange={handleRecipeChange}>
                <SelectTrigger>
                    <SelectValue placeholder={`-- ${t[recipeParam.nameId]} --`}>
                        {selectedItem && (
                            <span className="select-trigger">
                                {IconsData[selectedItem.icon]} {t[selectedItem.nameId]}
                            </span>
                        )}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {itemsId.map((t) => {
                        return <ParamItem itemId={t.id} key={t.id} />
                    })}
                </SelectContent>
            </Select>
        </div>
    )
})
const ParamItem = memo(function ParamItem(props: { itemId: string }) {
    const { itemId } = props
    const { t } = useTranslations()
    const { f } = useNumberFormatter()

    const itemObj = useGameStore(selectGameItem(itemId))
    const qta = useGameStore(selectItemQta(null, itemId))
    const text = itemObj ? t[itemObj.nameId] : t.None

    return (
        <SelectItem value={itemId} icon={itemObj && IconsData[itemObj.icon]} className={classes.seleBtn}>
            <span className={classes.item}>
                <span className={classes.text}>{text}</span>
                <span className="text-muted-foreground">{f(qta)}</span>
            </span>
        </SelectItem>
    )
})
