import { Fragment, memo, ReactNode, useCallback } from 'react'
import { GiRock } from 'react-icons/gi'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/select'
import { GameState } from '../../game/GameState'
import { Msg } from '../../msg/Msg'
import { PLAYER_ID } from '../../characters/charactersConst'
import { Card, CardContent } from '../../components/ui/card'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { getCharacterSelector } from '../../characters/getCharacterSelector'
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

    const itemsId = useGameStore(useCallback((s: GameState) => selectItemsByType(slotData.ItemType)(s), [slotData]))

    const handleEquipChange = useCallback((value: string) => changeEquip(slot, value, charId), [slot, charId])

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
                <Select value={itemId ?? '-'} onValueChange={handleEquipChange}>
                    <SelectTrigger>
                        <SelectValue>
                            <span className="grid grid-flow-col items-center gap-2">
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
                            <Fragment key={t.id}>
                                {index !== 0 && <SelectSeparator />}
                                <OptionItem itemId={t.id} slot={slot} />
                            </Fragment>
                        ))}
                    </SelectContent>
                </Select>
            </CardContent>
        </Card>
    )
})

const OptionItem = memo(function ParamItem(props: { itemId: string; slot: EquipSlotsEnum }) {
    const { itemId, slot } = props
    const itemObj = useGameStore(selectGameItem(itemId))
    const { t } = useTranslations()
    const text = itemObj ? t[itemObj.nameId] : t.None

    let icon: ReactNode | undefined
    if (itemObj) icon = <span className="text-2xl">{IconsData[itemObj.icon]}</span>

    return (
        <SelectItem value={itemId} icon={icon}>
            <OptionItemInt name={text} slot={slot} item={itemObj} />
        </SelectItem>
    )
})
const OptionItemInt = memo(function AxeItemInt(props: { name: string; slot: EquipSlotsEnum; item?: Item }) {
    const { name, slot, item } = props

    return (
        <div>
            <span className="leading-none font-medium">{name}</span>
            <div className="text-muted-foreground flex max-w-md flex-wrap gap-2 text-sm leading-none font-medium">
                {slot === EquipSlotsEnum.WoodAxe && <WoodAxeDataUi woodAxeData={item?.woodAxeData ?? DEF_WOOD_AXE} />}
                {slot === EquipSlotsEnum.Pickaxe && <PickaxeDataUi pickaxeData={item?.pickaxeData ?? DEF_PICKAXE} />}
            </div>
        </div>
    )
})
