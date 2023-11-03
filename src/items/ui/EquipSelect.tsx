import { memo, ReactNode, useCallback } from 'react'
import { GiCube } from 'react-icons/gi'
import { getRecipeParamId } from '../../crafting/CraftingFunctions'
import { useGameStore } from '../../game/state'
import { IconsData } from '../../icons/Icons'
import { useTranslations } from '../../msg/useTranslations'
import { selectItemsByType, selectGameItem } from '../../storage/StorageSelectors'
import { getItemId2 } from '../../storage/storageFunctions'
import { ItemId } from '../../storage/storageState'
import { Item, SlotsData } from '../Item'
import { PickaxeDataUi, WoodAxeDataUi } from './ItemInfo'
import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
import { selectEquipId, selectEquippedItem } from '../itemSelectors'
import { changeEquip } from '../itemFunctions'
import { DEF_PICKAXE } from '../../mining/miningSelectors'
import { DEF_WOOD_AXE } from '../../wood/WoodcuttingSelectors'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { GameState } from '../../game/GameState'
import { Label } from '@radix-ui/react-label'
import { SmallCard } from '../../ui/myCard/myCard'
import classes from './equipSelect.module.css'

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
    const handleEquipChange = (value: string) => changeEquip(slot, value)
    let name = t.None
    let icon: ReactNode = <GiCube />
    if (equipped) {
        name = t[equipped.nameId]
        icon = IconsData[equipped.icon]
    }

    return (
        <SmallCard className={classes.container}>
            <Label>{t[slotData.ItemType]}</Label>
            <Select value={axeId} onValueChange={handleEquipChange}>
                <SelectTrigger>
                    <SelectValue>
                        <span className={classes.title}>
                            {icon}
                            {name}
                        </span>
                    </SelectValue>
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="" icon={<GiCube />}>
                        <OptionItemInt name={t.None} slot={slot} />
                    </SelectItem>
                    {itemsId.map((t) => {
                        const value = getItemId2(t.stdItemId, t.craftItemId)
                        return <OptionItem itemId={t} key={value} slot={slot} />
                    })}
                </SelectContent>
            </Select>
        </SmallCard>
    )
})
const OptionItem = memo(function ParamItem(props: { itemId: ItemId; slot: EquipSlotsEnum }) {
    const { itemId, slot } = props
    const value = getRecipeParamId(itemId)
    const itemObj = useGameStore(selectGameItem(itemId?.stdItemId ?? null, itemId?.craftItemId ?? null))
    const { t } = useTranslations()
    const text = itemObj ? t[itemObj.nameId] : t.None

    let icon: ReactNode = <GiCube />
    if (itemObj) icon = IconsData[itemObj.icon] ?? <GiCube />

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
            <ul>
                {slot === EquipSlotsEnum.WoodAxe && <WoodAxeDataUi woodAxeData={item?.woodAxeData ?? DEF_WOOD_AXE} />}
                {slot === EquipSlotsEnum.Pickaxe && <PickaxeDataUi pickaxeData={item?.pickaxeData ?? DEF_PICKAXE} />}
            </ul>
        </span>
    )
})
