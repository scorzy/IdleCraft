import { memo } from 'react'
import { Card, CardContent } from '../../components/ui/card'
import { useGameStore } from '../../game/state'
import { selectItemFilterDetail, selectItemFilterSearch, selectItemFilterType } from '../../ui/state/uiSelectors'
import { Toggle } from '@/components/ui/toggle'
import { Icons, IconsData } from '../../icons/Icons'
import { setItemFilterDetail, setItemFilterSearch, setItemFilterType } from '../../ui/state/uiFunctions'
import { CraftingType, EquipmentSlot, ItemType, ToolType, WeaponType } from '../../items/Item'
import { ItemDetailData, ItemTypeData } from '../../items/ItemTypeData'
import { useTranslations } from '../../msg/useTranslations'
import { TextInput } from '../../components/ui/textInput'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip'

type ItemFilterDetailType = WeaponType | EquipmentSlot | ToolType | CraftingType
interface UiTypeFilter {
    type: ItemFilterDetailType
    icon: Icons
    name: string
}
const getItemDetailsForType = (itemType: ItemType): UiTypeFilter[] => {
    const details =
        itemType === ItemType.Weapon
            ? Object.values(WeaponType)
            : itemType === ItemType.Armour
              ? Object.values(EquipmentSlot)
              : itemType === ItemType.Tool
                ? Object.values(ToolType)
                : itemType === ItemType.Crafting
                  ? Object.values(CraftingType)
                  : []
    return details.map((type) => ({ type, icon: ItemDetailData[type].icon, name: ItemDetailData[type].nameId }))
}
export const ItemFilters = memo(function ItemFilters() {
    return (
        <Card>
            <CardContent className="flex flex-col gap-1">
                <ItemFilterType />
                <ItemFilterDetail />
                <ItemSearch />
            </CardContent>
        </Card>
    )
})
export const ItemFilterType = memo(function ItemFilterType() {
    const itemFilterType = useGameStore(selectItemFilterType)

    return (
        <div className="flex items-center space-x-2">
            {Object.values(ItemType).map((itemType) => (
                <UIFilterType
                    key={itemType}
                    title={ItemTypeData[itemType].nameId}
                    icon={ItemTypeData[itemType].icon}
                    pressed={itemFilterType === itemType}
                    onClick={(pressed) => setItemFilterType(pressed ? itemType : undefined)}
                />
            ))}
        </div>
    )
})
export const ItemFilterDetail = memo(function ItemFilterDetail() {
    const itemFilterType = useGameStore(selectItemFilterType)
    const itemFilterDetail = useGameStore(selectItemFilterDetail)
    const typesData = itemFilterType ? getItemDetailsForType(itemFilterType) : []

    return (
        <div className="flex items-center space-x-2">
            {typesData.map((filter) => (
                <UIFilterType
                    key={filter.type}
                    title={filter.name}
                    icon={filter.icon}
                    pressed={itemFilterDetail === filter.type}
                    onClick={(pressed) => setItemFilterDetail(pressed ? filter.type : undefined)}
                />
            ))}
        </div>
    )
})
export const UIFilterType = memo(function UIFilterType({
    onClick,
    title,
    pressed,
    icon,
}: {
    onClick: (pressed: boolean) => void
    title: string
    pressed: boolean
    icon: Icons
}) {
    return (
        <Tooltip>
            <TooltipTrigger
                render={
                    <Toggle aria-label={title} pressed={pressed} variant={'primary'} onPressedChange={onClick}>
                        {IconsData[icon]}
                    </Toggle>
                }
            />
            <TooltipContent>{title}</TooltipContent>
        </Tooltip>
    )
})

const onChange = (v: string) => setItemFilterSearch(v)
export const ItemSearch = memo(function ItemSearch() {
    const itemFilterSearch = useGameStore(selectItemFilterSearch)
    const { t } = useTranslations()

    return <TextInput id="SearchItem" title={t.SearchItem} text={itemFilterSearch} clearable onChange={onChange} />
})
