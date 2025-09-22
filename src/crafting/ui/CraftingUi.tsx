import { memo, useCallback, useMemo } from 'react'
import { LuHourglass } from 'react-icons/lu'
import { useShallow } from 'zustand/react/shallow'
import { RecipeParamType, RecipeParameter, RecipeTypes } from '../RecipeInterfaces'
import { recipes } from '../Recipes'
import { useGameStore } from '../../game/state'
import {
    canCraft,
    selectCraftingIds,
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
import { MyPage, MyPageAll } from '../../ui/pages/MyPage'
import { removeActivity } from '../../activities/functions/removeActivity'
import { addCraftingClick } from '../functions/addCrafting'
import { handleRecipeChange } from '../CraftingFunctions'
import { Card, CardContent } from '../../components/ui/card'
import { PLAYER_ID } from '../../characters/charactersConst'
import { IconsData } from '../../icons/Icons'
import { ComboBox, ComboBoxOption } from '../../components/ui/combobox'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { GameState } from '../../game/GameState'
import { ActivitiesList } from '../../activities/ui/Activities'
import { CraftingReq, CraftingResult } from './CraftingResult'
import classes from './craftingUi.module.css'
import { Label } from '@/components/ui/label'

const recipesByType: Partial<Record<RecipeTypes, Recipe[]>> = {}

const selectRecipes = (t: RecipeTypes) => {
    const ret1 = recipesByType[t]
    if (ret1) return ret1

    const ret: Recipe[] = []
    const recipeValues = recipes.values()
    for (const recipe of recipeValues) if (recipe.type === t) ret.push(recipe)
    recipesByType[t] = ret
    return ret
}

export const CraftingUi = memo(function CraftingUi() {
    const result = useGameStore(selectRecipeResult)
    const req = useGameStore(selectRecipeReq)
    const recipeType = useGameStore(selectRecipeType)
    const { t } = useTranslations()

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

                <CraftingQueue />
            </MyPage>
        </MyPageAll>
    )
})

const CraftingQueue = memo(function CraftingQueue() {
    const ids = useGameStore(selectCraftingIds)
    return <ActivitiesList ids={ids} filtered={true} />
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

    const options: ComboBoxOption[] = recipesByType.map((r) => ({
        value: r.id,
        label: t[r.nameId],
        icon: IconsData[r.iconId],
        searchText: t[r.nameId]
    }))

    return (
        <ComboBox
            value={recipeId ?? ''}
            onValueChange={handleRecipeChange}
            options={options}
            placeholder={t.SelectARecipe}
            searchPlaceholder={`${t.Search}...`}
            emptyMessage={t.NoResults}
        >
            {selected && (
                <span className="flex items-center gap-2">
                    {IconsData[selected.iconId]} {t[selected.nameId]}
                </span>
            )}
        </ComboBox>
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
    const { f } = useNumberFormatter()
    const itemsId = useGameStore(useShallow(selectItemsByType(recipeParam.itemType)))
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

    // Create options with current state data
    const options: ComboBoxOption[] = useMemo(() => {
        return itemsId.map((itemId) => {
            const state = useGameStore.getState()
            const itemObj = selectGameItem(itemId)(state)
            const qta = selectItemQta(null, itemId)(state)
            const text = itemObj ? t[itemObj.nameId] : t.None

            return {
                value: itemId,
                label: text,
                icon: itemObj && IconsData[itemObj.icon],
                rightSlot: <span className="text-muted-foreground">{f(qta)}</span>,
                searchText: text
            }
        })
    }, [itemsId, t, f])

    return (
        <div>
            <Label>{t[recipeParam.nameId]}</Label>
            <ComboBox
                value={selectedValue ?? ''}
                onValueChange={handleRecipeChange}
                options={options}
                placeholder={`-- ${t[recipeParam.nameId]} --`}
                searchPlaceholder={`${t.Search}...`}
                emptyMessage={t.NoResults}
            >
                {selectedItem && (
                    <span className="flex items-center gap-2">
                        {IconsData[selectedItem.icon]} {t[selectedItem.nameId]}
                    </span>
                )}
            </ComboBox>
        </div>
    )
})
