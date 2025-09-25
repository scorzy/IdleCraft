import { Fragment, memo, ReactNode, useCallback } from 'react'
import { GiRock } from 'react-icons/gi'
import { useShallow } from 'zustand/react/shallow'
import { useGameStore } from '../../game/state'
import { IconsData } from '../../icons/Icons'
import { useTranslations } from '../../msg/useTranslations'
import { selectItemsByType, selectGameItem } from '../../storage/StorageSelectors'
import { Item } from '../Item'
import { SlotsData } from '../slotsData'
import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
import { selectEquipId } from '../itemSelectors'
import { changeEquip } from '../itemFunctions'
import { DEF_PICKAXE } from '../../mining/miningSelectors'
import { DEF_WOOD_AXE } from '../../wood/selectors/WoodcuttingSelectors'
import { SelectSeparator } from '../../components/ui/select'
import { GameState } from '../../game/GameState'
import { Msg } from '../../msg/Msg'
import { PLAYER_ID } from '../../characters/charactersConst'
import { Card, CardContent } from '../../components/ui/card'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { getCharacterSelector } from '../../characters/getCharacterSelector'
import { ComboBoxItem, ComboBoxResponsive } from '../../components/ui/comboBox'
import { PickaxeDataUi, WoodAxeDataUi } from './ItemInfo'

const noIcon = <GiRock />

export const EquipItemUi = memo(function EquipItemUi(props: { slot: EquipSlotsEnum; charId?: string }) {
    const { slot } = props
    const charId = props.charId ?? PLAYER_ID
    const { t } = useTranslations()
    const slotData = SlotsData[slot]

    const equipped = useGameStore(
        useCallback((s: GameState) => getCharacterSelector(charId).EquippedItem(s, slot), [slot, charId])
    )
    const itemId = useGameStore(useCallback((s: GameState) => selectEquipId(slot, charId)(s), [slot, charId]))

    const itemsId = useGameStore(
        useShallow(useCallback((s: GameState) => selectItemsByType(slotData.ItemType)(s), [slotData]))
    )

    let name = t.None
    let icon: ReactNode = noIcon
    if (equipped) {
        name = t[equipped.nameId]
        icon = IconsData[equipped.icon]
    }

    return (
        <Card gap="sm">
            <MyCardHeaderTitle title={t[slotData.ItemType as keyof Msg]} />
            <CardContent>
                <ComboBoxResponsive
                    selectedId={itemId ?? '-'}
                    triggerContent={
                        <span className="grid grid-flow-col items-center gap-2">
                            {icon}
                            {name}
                        </span>
                    }
                >
                    <OptionItem itemId="-" slot={slot} charId={charId} defIcon={<GiRock />} />
                    {itemsId.length > 0 && <SelectSeparator />}
                    {itemsId.map((t, index) => (
                        <Fragment key={t}>
                            {index !== 0 && <SelectSeparator />}
                            <OptionItem itemId={t} slot={slot} charId={charId} />
                        </Fragment>
                    ))}
                </ComboBoxResponsive>
            </CardContent>
        </Card>
    )
})

const OptionItem = memo(function ParamItem({
    itemId,
    slot,
    charId,
    defIcon,
}: {
    itemId: string
    slot: EquipSlotsEnum
    charId: string
    defIcon?: ReactNode
}) {
    const itemObj = useGameStore(selectGameItem(itemId))
    const { t } = useTranslations()
    const text = itemObj ? t[itemObj.nameId] : t.None

    let icon: ReactNode | undefined
    if (!itemObj) icon = defIcon
    else if (itemObj) icon = IconsData[itemObj.icon]

    const handleEquipChange = useCallback(() => changeEquip(slot, itemId, charId), [slot, itemId, charId])

    return (
        <ComboBoxItem
            value={itemId}
            icon={<span className="text-2xl">{icon}</span>}
            onSelect={handleEquipChange}
            bottomSlot={<OptionItemInt name={text} slot={slot} item={itemObj} />}
        >
            <span className="leading-none font-medium">{text}</span>
        </ComboBoxItem>
    )
})

const OptionItemInt = memo(function AxeItemInt({ slot, item }: { name: string; slot: EquipSlotsEnum; item?: Item }) {
    return (
        <div className="flex max-w-md flex-wrap gap-2 leading-none">
            {slot === EquipSlotsEnum.WoodAxe && <WoodAxeDataUi woodAxeData={item?.woodAxeData ?? DEF_WOOD_AXE} />}
            {slot === EquipSlotsEnum.Pickaxe && <PickaxeDataUi pickaxeData={item?.pickaxeData ?? DEF_PICKAXE} />}
        </div>
    )
})
