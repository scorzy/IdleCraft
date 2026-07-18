import { memo, useCallback } from 'react'
import { LuHourglass } from 'react-icons/lu'
import { removeActivity } from '../../activities/functions/removeActivity'
import { ActivitiesList } from '../../activities/ui/Activities'
import { AddActivityDialog } from '../../activities/ui/AddActivityDialog'
import { PLAYER_ID } from '../../characters/charactersConst'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { ComboBoxItem, ComboBoxResponsive } from '../../components/ui/comboBox'
import { ExperienceCard } from '../../experience/ui/ExperienceCard'
import { useGameStore } from '../../game/state'
import { IconsData } from '../../icons/Icons'
import { ItemFilterDescription } from '../../items/ui/ItemFilterUI'
import { ItemIconName } from '../../items/ui/ItemIconName'
import { useTranslations } from '../../msg/useTranslations'
import { ItemsSelect } from '../../storage/ui/ItemsSelect'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { MyPage, MyPageAll } from '../../ui/pages/MyPage'
import { GameTimerProgress } from '../../ui/progress/TimerProgress'
import { handleRecipeChange, handleRecipeGroupChange } from '../CraftingFunctions'
import {
    canCraft,
    selectCraftingIds,
    selectCraftTime,
    selectCurrentCrafting,
    selectRecipeGroup,
    selectRecipeId,
    selectRecipeItemValue,
    selectRecipeParams,
    selectRecipeReq,
    selectRecipeResult,
    selectRecipeResultItem,
    selectRecipeType,
} from '../CraftingSelectors'
import { addCraftingClick } from '../functions/addCrafting'
import { Recipe } from '../Recipe'
import { RecipeData } from '../RecipeData'
import { RecipeGroupsData, RecipeGroupsList } from '../RecipeGroupsData'
import { setRecipeItemParamUi } from '../RecipeFunctions'
import {
    isRecipeParameterItemFilter,
    RecipeParameter,
    RecipeParameterItemFilter,
    RecipeTypes,
} from '../RecipeInterfaces'
import { recipes } from '../Recipes'
import { CraftingReq, CraftingResult } from './CraftingResult'
import classes from './craftingUi.module.css'

const recipesByType: Partial<Record<RecipeTypes, Recipe[]>> = {}

const selectRecipes = (t: RecipeTypes, recipeGroup?: Recipe['recipeGroup']) => {
    const ret1 = recipesByType[t]
    if (ret1) return recipeGroup ? ret1.filter((r) => r.recipeGroup === recipeGroup) : ret1

    const ret: Recipe[] = []
    const recipeValues = recipes.values()
    for (const recipe of recipeValues) if (recipe.type === t) ret.push(recipe)
    recipesByType[t] = ret
    return recipeGroup ? ret.filter((r) => r.recipeGroup === recipeGroup) : ret
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
                    {result &&
                        result?.map((r) => (
                            <CardContent key={r.id}>
                                <CraftingResult result={r} />
                            </CardContent>
                        ))}
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
                    <RecipeGroupSelectUi />
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

const RecipeGroupSelectUi = memo(function RecipeGroupSelectUi() {
    const recipeType = useGameStore(selectRecipeType)
    const recipeGroup = useGameStore(selectRecipeGroup)
    const { t } = useTranslations()

    if (recipeType !== RecipeTypes.Smithing || !recipeGroup) return null

    const selected = RecipeGroupsData[recipeGroup]

    return (
        <ComboBoxResponsive
            filter={false}
            label={t.Filter}
            selectedId={recipeGroup}
            triggerContent={
                <span className="select-trigger">
                    {IconsData[selected.icon]} {t[selected.nameId]}
                </span>
            }
        >
            {RecipeGroupsList.map((group) => {
                const data = RecipeGroupsData[group]

                return (
                    <ComboBoxItem
                        key={group}
                        value={group}
                        icon={IconsData[data.icon]}
                        onSelect={() => handleRecipeGroupChange(group)}
                    >
                        {t[data.nameId]}
                    </ComboBoxItem>
                )
            })}
        </ComboBoxResponsive>
    )
})

const RecipeSelectUi = memo(function RecipeSelectUi() {
    const recipeType = useGameStore(selectRecipeType)
    const recipeGroup = useGameStore(selectRecipeGroup)
    const recipeId = useGameStore(selectRecipeId)
    const { t } = useTranslations()

    if (!recipeType) return
    const recipesByTypeList = selectRecipes(recipeType, recipeType === RecipeTypes.Smithing ? recipeGroup : undefined)
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
                        {/* {removeUnusedParams(t[selected.nameId])} */}
                    </span>
                ) : (
                    `-- ${t.SelectARecipe} --`
                )
            }
        >
            {recipesByTypeList.map((r) => (
                <ComboBoxItem
                    key={r.id}
                    value={r.id}
                    icon={IconsData[r.iconId]}
                    onSelect={() => handleRecipeChange(r)}
                    selected={r.id === recipeId}
                >
                    {t[r.nameId]}
                    {/* {removeUnusedParams(t[r.nameId])} */}
                </ComboBoxItem>
            ))}
        </ComboBoxResponsive>
    )
})

const CraftingButtons = memo(function CraftingButtons() {
    const { t, fun } = useTranslations()
    const time = useGameStore(selectCraftTime)

    const id = useGameStore(selectCurrentCrafting)
    const onClickRemove = useCallback(() => removeActivity(id), [id])

    return (
        <>
            <Badge className={classes.timeBadge} variant="secondary">
                <LuHourglass />
                {time ? fun.formatTime(time) : '-'}
            </Badge>
            {id === null && <AddCraftingDialog />}
            {id !== null && (
                <Button type="submit" className="w-min" variant="destructive" onClick={onClickRemove}>
                    {t.Remove}
                </Button>
            )}
            <GameTimerProgress actionId={id} color="primary" />
        </>
    )
})

const AddCraftingDialog = memo(function AddCraftingDialog() {
    const { t } = useTranslations()

    const bntEnabled = useGameStore(canCraft)
    const resultItem = useGameStore(selectRecipeResultItem)

    return (
        <AddActivityDialog
            addBtn={
                <Button type="submit" className="w-min" onClick={addCraftingClick} disabled={!bntEnabled}>
                    {t.Craft}
                </Button>
            }
            title={resultItem ? <ItemIconName itemId={resultItem} /> : t.Craft}
            openBtn={
                <Button className="w-min" disabled={!bntEnabled}>
                    {t.Craft}
                </Button>
            }
        />
    )
})

const RecipeParamUi = memo(function RecipeParamUi(props: { recipeParam: RecipeParameter }) {
    const { recipeParam } = props

    if (isRecipeParameterItemFilter(recipeParam)) return <RecipeParamItemType recipeParam={recipeParam} />
})

const RecipeParamItemType = memo(function RecipeParamItemType(props: { recipeParam: RecipeParameterItemFilter }) {
    const { recipeParam } = props

    const selected = useGameStore(selectRecipeItemValue(recipeParam.id))

    const handleItemChange = useCallback(
        (itemId: string) => setRecipeItemParamUi(recipeParam.id, itemId),
        [recipeParam.id]
    )

    return (
        <ItemsSelect
            itemFilter={recipeParam.itemFilter}
            selectedValue={selected?.itemId}
            onValueChange={handleItemChange}
            label={<ItemFilterDescription itemFilter={recipeParam.itemFilter} />}
        />
    )
})
