import { Fragment, memo, ReactNode, useCallback } from 'react'
import { Label } from '@radix-ui/react-label'
import { TbX } from 'react-icons/tb'
import { useGameStore } from '../../game/state'
import { IconsData } from '../../icons/Icons'
import { useTranslations } from '../../msg/useTranslations'
import { selectItemsByType, selectGameItem } from '../../storage/StorageSelectors'
import { getItemId2 } from '../../storage/storageFunctions'
import { ItemId } from '../../storage/storageState'
import { Item, SlotsData } from '../Item'
import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
import { selectEquipId, selectEquippedItem } from '../itemSelectors'
import { changeEquip } from '../itemFunctions'
import { DEF_PICKAXE } from '../../mining/miningSelectors'
import { DEF_WOOD_AXE } from '../../wood/selectors/WoodcuttingSelectors'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/select'
import { GameState } from '../../game/GameState'
import { SmallCard } from '../../ui/myCard/myCard'
import { getRecipeParamId } from '../../crafting/RecipeFunctions'
import { Button } from '../../components/ui/button'
import classes from './equipSelect.module.css'
import { PickaxeDataUi, WoodAxeDataUi } from './ItemInfo'

export const EquipItemUi = memo(function EquipItemUi(props: { slot: EquipSlotsEnum }) {
    const { slot } = props
    const { t } = useTranslations()
    const slotData = SlotsData[slot]

    const selectEquippedItemMemo = useCallback((state: GameState) => selectEquippedItem(slot)(state), [slot])
    const selectEquipIdMemo = useCallback((state: GameState) => selectEquipId(slot)(state), [slot])
    const selectItemsByTypeMemo = useCallback(
        (state: GameState) => selectItemsByType(slotData.ItemType)(state),
        [slotData]
    )

    const equipped = useGameStore(selectEquippedItemMemo)
    const axeId = useGameStore(selectEquipIdMemo)
    const itemsId = useGameStore(selectItemsByTypeMemo)
    const handleEquipChange = useCallback((value: string) => changeEquip(slot, value), [slot])
    const clear = useCallback(() => changeEquip(slot, ''), [slot])

    let name = t.None
    let icon: ReactNode | undefined
    if (equipped) {
        name = t[equipped.nameId]
        icon = IconsData[equipped.icon]
    }
    const count = itemsId.length - 1

    return (
        <SmallCard className={classes.container}>
            <Label>{t[slotData.ItemType]}</Label>
            <div className={classes.selectCont}>
                <Select value={axeId} onValueChange={handleEquipChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="None">
                            <span className={classes.title}>
                                {icon}
                                {name}
                            </span>
                        </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                        {itemsId.map((t, index) => (
                            <Fragment key={getItemId2(t.stdItemId, t.craftItemId)}>
                                <OptionItem itemId={t} slot={slot} />
                                {count !== index && <SelectSeparator />}
                            </Fragment>
                        ))}
                    </SelectContent>
                </Select>
                <Button variant="outline" onClick={clear}>
                    <TbX />
                </Button>
            </div>
        </SmallCard>
    )
})
const OptionItem = memo(function ParamItem(props: { itemId: ItemId; slot: EquipSlotsEnum }) {
    const { itemId, slot } = props
    const value = getRecipeParamId(itemId)
    const itemObj = useGameStore(selectGameItem(itemId?.stdItemId ?? null, itemId?.craftItemId ?? null))
    const { t } = useTranslations()
    const text = itemObj ? t[itemObj.nameId] : t.None

    let icon: ReactNode | undefined
    if (itemObj) icon = <span className="text-2xl">{IconsData[itemObj.icon]}</span>

    return (
        <SelectItem value={value} icon={icon}>
            <OptionItemInt name={text} slot={slot} item={itemObj} />
        </SelectItem>
    )
})
const OptionItemInt = memo(function AxeItemInt(props: { name: string; slot: EquipSlotsEnum; item?: Item }) {
    const { name, slot, item } = props

    return (
        <span>
            {name}
            <ul className="text-muted-foreground">
                {slot === EquipSlotsEnum.WoodAxe && <WoodAxeDataUi woodAxeData={item?.woodAxeData ?? DEF_WOOD_AXE} />}
                {slot === EquipSlotsEnum.Pickaxe && <PickaxeDataUi pickaxeData={item?.pickaxeData ?? DEF_PICKAXE} />}
            </ul>
        </span>
    )
})
