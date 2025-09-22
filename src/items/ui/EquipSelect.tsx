import { memo, ReactNode, useCallback, useMemo } from 'react'
import { GiRock } from 'react-icons/gi'
import { useShallow } from 'zustand/react/shallow'
import { useGameStore } from '../../game/state'
import { IconsData } from '../../icons/Icons'
import { useTranslations } from '../../msg/useTranslations'
import { selectItemsByType, selectGameItem } from '../../storage/StorageSelectors'
import { SlotsData } from '../SlotsData'
import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
import { selectEquipId } from '../itemSelectors'
import { changeEquip } from '../itemFunctions'
import { DEF_PICKAXE } from '../../mining/miningSelectors'
import { DEF_WOOD_AXE } from '../../wood/selectors/WoodcuttingSelectors'
import { ComboBox, ComboBoxOption } from '../../components/ui/combobox'
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

    const itemsId = useGameStore(
        useShallow(useCallback((s: GameState) => selectItemsByType(slotData.ItemType)(s), [slotData]))
    )

    const handleEquipChange = useCallback((value: string) => changeEquip(slot, value, charId), [slot, charId])

    let name = t.None
    let icon: ReactNode = noIcon
    if (equipped) {
        name = t[equipped.nameId]
        icon = IconsData[equipped.icon]
    }

    // Create options for ComboBox
    const options: ComboBoxOption[] = useMemo(() => {
        const opts: ComboBoxOption[] = [
            {
                value: '-',
                label: 'None',
                icon: <GiRock className="text-2xl" />,
                searchText: 'None',
                content: (
                    <span className="flex items-center gap-2 flex-1">
                        <span className="shrink-0"><GiRock className="text-2xl" /></span>
                        <div>
                            <span className="leading-none font-medium">None</span>
                        </div>
                    </span>
                )
            }
        ]
        
        itemsId.forEach((itemId) => {
            const state = useGameStore.getState()
            const itemObj = selectGameItem(itemId)(state)
            const text = itemObj ? t[itemObj.nameId] : t.None

            let itemIcon: ReactNode
            if (itemObj) itemIcon = <span className="text-2xl">{IconsData[itemObj.icon]}</span>

            // Create detailed content for equipment with stats
            const detailContent = (
                <span className="flex items-center gap-2 flex-1">
                    {itemIcon && <span className="shrink-0">{itemIcon}</span>}
                    <div>
                        <span className="leading-none font-medium">{text}</span>
                        <div className="text-muted-foreground flex max-w-md flex-wrap gap-2 text-sm leading-none font-medium">
                            {slot === EquipSlotsEnum.WoodAxe && <WoodAxeDataUi woodAxeData={itemObj?.woodAxeData ?? DEF_WOOD_AXE} />}
                            {slot === EquipSlotsEnum.Pickaxe && <PickaxeDataUi pickaxeData={itemObj?.pickaxeData ?? DEF_PICKAXE} />}
                        </div>
                    </div>
                </span>
            )

            opts.push({
                value: itemId,
                label: text,
                icon: itemIcon,
                searchText: text,
                content: detailContent
            })
        })
        
        return opts
    }, [itemsId, t, slot])

    return (
        <Card gap="sm">
            <MyCardHeaderTitle title={t[slotData.ItemType as keyof Msg]} />
            <CardContent>
                <ComboBox
                    value={itemId ?? '-'}
                    onValueChange={handleEquipChange}
                    options={options}
                    placeholder={t.None || 'None'}
                    searchPlaceholder={`${t.Search}...`}
                    emptyMessage={t.NoResults}
                >
                    <span className="grid grid-flow-col items-center gap-2">
                        {icon}
                        {name}
                    </span>
                </ComboBox>
            </CardContent>
        </Card>
    )
})
