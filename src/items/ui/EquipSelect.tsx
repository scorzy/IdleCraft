import { Fragment, memo, ReactNode, useCallback } from 'react'
import { GiRock } from 'react-icons/gi'
import { useGameStore } from '../../game/state'
import { IconsData } from '../../icons/Icons'
import { useTranslations } from '../../msg/useTranslations'
import { selectItemsByType, selectGameItem } from '../../storage/StorageSelectors'
import { ItemId } from '../../storage/storageState'
import { Item } from '../Item'
import { SlotsData } from '../slotsData'
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
import { getRecipeParamId } from '../../crafting/RecipeFunctions'
import { Msg } from '../../msg/Msg'
import { PLAYER_ID } from '../../characters/charactersConst'
import { getItemId2 } from '../../storage/getItemId2'
import classes from './equipSelect.module.css'
import { PickaxeDataUi, WoodAxeDataUi } from './ItemInfo'

const noIcon = <GiRock />

export const EquipItemUi = memo(function EquipItemUi(props: { slot: EquipSlotsEnum; charId?: string }) {
    const { slot } = props
    const charId = props.charId ?? PLAYER_ID
    const { t } = useTranslations()
    const slotData = SlotsData[slot]

    const selectEquippedItemMemo = useCallback(
        (state: GameState) => selectEquippedItem(slot, charId)(state),
        [slot, charId]
    )
    const selectEquipIdMemo = useCallback((state: GameState) => selectEquipId(slot, charId)(state), [slot, charId])
    const selectItemsByTypeMemo = useCallback(
        (state: GameState) => selectItemsByType(slotData.ItemType)(state),
        [slotData]
    )

    const equipped = useGameStore(selectEquippedItemMemo)
    const itemId = useGameStore(selectEquipIdMemo)
    const itemsId = useGameStore(selectItemsByTypeMemo)
    const handleEquipChange = useCallback((value: string) => changeEquip(slot, value, charId), [slot, charId])

    let name = t.None
    let icon: ReactNode = noIcon
    if (equipped) {
        name = t[equipped.nameId]
        icon = IconsData[equipped.icon]
    }

    return (
        <div>
            <span className="text-sm font-medium">{t[slotData.ItemType as keyof Msg]}</span>
            <Select value={itemId ?? '-'} onValueChange={handleEquipChange}>
                <SelectTrigger>
                    <SelectValue>
                        <span className={classes.title}>
                            {icon}
                            {name}
                        </span>
                    </SelectValue>
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="-" icon={<GiRock className="text-2xl" />}>
                        <OptionItemInt name={'None'} slot={slot} />
                    </SelectItem>
                    {itemsId.length > 0 && <SelectSeparator />}
                    {itemsId.map((t, index) => (
                        <Fragment key={getItemId2(t.stdItemId, t.craftItemId)}>
                            {index !== 0 && <SelectSeparator />}
                            <OptionItem itemId={t} slot={slot} />
                        </Fragment>
                    ))}
                </SelectContent>
            </Select>
        </div>
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
