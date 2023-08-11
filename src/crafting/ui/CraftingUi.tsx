import { memo } from 'react'
import { MyCard } from '../../ui/myCard/myCard'
import { Page } from '../../ui/shell/AppShell'
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, ListItemIcon, ListItemText } from '@mui/material'
import { memoize } from '../../utils/memoize'
import { RecipeParamType, RecipeParameter, RecipeTypes } from '../Recipe'
import { Recipes } from '../Recipes'
import { useGameStore } from '../../game/state'
import { changeRecipe, getRecipeParamId, setRecipeItemParam } from '../CraftingFunctions'
import { selectRecipeItemValue, selectRecipeParams, selectRecipeReq, selectRecipeResult } from '../CraftingSelectors'
import { selectItem, selectItemQta, selectItemsByType } from '../../storage/StorageSelectors'
import { useTranslations } from '../../msg/useTranslations'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { IconsData } from '../../icons/Icons'
import classes from './craftingUi.module.css'
import { CraftingReq, CraftingResult } from './CraftingResult'
import { getItemId } from '../../storage/storageFunctions'

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
    const handleRecipeChange = (event: SelectChangeEvent<string>) => changeRecipe(event.target.value)

    if (!recipeType) return <></>
    const recipes = selectRecipes(recipeType)

    return (
        <FormControl fullWidth>
            <InputLabel id="recipe-label-Id">{t.Recipe}</InputLabel>
            <Select
                labelId="recipe-label-Id"
                id="recipe-select"
                value={recipeId}
                label="Recipe"
                onChange={handleRecipeChange}
            >
                <MenuItem value={''}>{t.None}</MenuItem>
                {recipes.map((r) => (
                    <MenuItem key={r.id} value={r.id}>
                        {t[r.nameId]}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
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
    const handleRecipeChange = (event: SelectChangeEvent<string>) =>
        setRecipeItemParam(recipeParam.id, event.target.value ?? '')
    const selectedValue = getRecipeParamId(selected)
    return (
        <FormControl fullWidth>
            <InputLabel id={`${recipeParam.id}-label`}>{t[recipeParam.nameId]}</InputLabel>
            <Select
                labelId={`${recipeParam.id}-label`}
                id={recipeParam.id}
                value={selectedValue}
                label={t[recipeParam.nameId]}
                onChange={handleRecipeChange}
                renderValue={(value) => {
                    return (
                        <MenuItem key={value} value={value}>
                            <ParamItem item={value} />
                        </MenuItem>
                    )
                }}
            >
                <MenuItem value={undefined}> {t.None} </MenuItem>
                {itemsId.map((t) => {
                    const value = getRecipeParamId(t)
                    return (
                        <MenuItem key={value} value={value} selected={value === selectedValue}>
                            <ParamItem item={value} />
                        </MenuItem>
                    )
                })}
            </Select>
        </FormControl>
    )
})
const ParamItem = memo(function ParamItem(props: { item: string }) {
    const { item } = props
    const itemId = getItemId(item)
    const itemObj = useGameStore(selectItem(itemId?.stdItemId ?? null, itemId?.craftItemId ?? null))
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    const qta = useGameStore(selectItemQta(null, itemId?.stdItemId ?? null, itemId?.craftItemId ?? null))
    const text = itemObj ? t[itemObj.nameId] : t.None

    return (
        <>
            <ListItemIcon>{itemObj && IconsData[itemObj.icon]}</ListItemIcon>
            <ListItemText
                primary={
                    <>
                        {text} <span className="monospace">{f(qta)}</span>
                    </>
                }
            />
        </>
    )
})
