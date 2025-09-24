import { memo, useCallback } from 'react'
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
import { GameState } from '../../game/GameState'
import { ActivitiesList } from '../../activities/ui/Activities'
import { ComboBoxItem, ComboBoxResponsive } from '../../components/ui/comboBox'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { CraftingReq, CraftingResult } from './CraftingResult'
import classes from './craftingUi.module.css'

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
    const icon = selected && IconsData[selected.iconId]

    return (
        <ComboBoxResponsive
            label={t.Recipe}
            selectedId={selected?.id ?? null}
            triggerContent={
                selected ? (
                    <span className="select-trigger">
                        {icon} {t[selected.nameId]}
                    </span>
                ) : (
                    `-- ${t.SelectARecipe} --`
                )
            }
        >
            {recipesByType.map((r) => (
                <ComboBoxItem
                    key={r.id}
                    value={r.id}
                    icon={IconsData[r.iconId]}
                    onSelect={() => handleRecipeChange(r)}
                    selected={r.id === recipeId}
                >
                    {t[r.nameId]}
                </ComboBoxItem>
            ))}
        </ComboBoxResponsive>
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
    const itemsId = useGameStore(useShallow(selectItemsByType(recipeParam.itemType)))
    const selected = useGameStore(selectRecipeItemValue(recipeParam.id))

    const selectedItem = useGameStore((s: GameState) => {
        if (!selected) return null
        return selectGameItem(selected.itemId)(s)
    })

    return (
        <ComboBoxResponsive
            label={t[recipeParam.nameId]}
            selectedId={selected?.itemId ?? null}
            triggerContent={
                selectedItem ? (
                    <span className="select-trigger">
                        {IconsData[selectedItem.icon]} {t[selectedItem.nameId]}
                    </span>
                ) : (
                    `-- ${t[recipeParam.nameId]} --`
                )
            }
        >
            {itemsId.map((t) => (
                <ParamItem itemId={t} key={t} recipeParamId={recipeParam.id} />
            ))}
        </ComboBoxResponsive>
    )
})
const ParamItem = memo(function ParamItem({ itemId, recipeParamId }: { itemId: string; recipeParamId: string }) {
    const { t } = useTranslations()

    const itemObj = useGameStore(selectGameItem(itemId))
    const text = itemObj ? t[itemObj.nameId] : t.None

    const handleRecipeChange = useCallback(() => setRecipeItemParamUi(recipeParamId, itemId), [recipeParamId, itemId])

    return (
        <ComboBoxItem
            value={itemId}
            icon={itemObj && IconsData[itemObj.icon]}
            className={classes.seleBtn}
            onSelect={handleRecipeChange}
            rightSlot={<ParamItemQta itemId={itemId} />}
        >
            <span className={classes.item}>
                <span className={classes.text}>{text}</span>
            </span>
        </ComboBoxItem>
    )
})
const ParamItemQta = memo(function ParamItemQta({ itemId }: { itemId: string }) {
    const { f } = useNumberFormatter()
    const qta = useGameStore(selectItemQta(null, itemId))

    return <Badge variant="secondary">{f(qta)}</Badge>
})
