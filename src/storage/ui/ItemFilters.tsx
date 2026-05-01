import { ChangeEvent, memo } from 'react'
import { Card, CardContent } from '../../components/ui/card'
import { useGameStore } from '../../game/state'
import { selectItemFilterSearch, selectItemFilterSubType, selectItemFilterType } from '../../ui/state/uiSelectors'
import { Toggle } from '@/components/ui/toggle'
import { Icons, IconsData } from '../../icons/Icons'
import { setItemFilterSearch, setItemFilterSubType, setItemFilterType } from '../../ui/state/uiFunctions'
import { ItemSubType, ItemTypes } from '../../items/Item'
import { getItemSubType } from '../../items/getItemSubType'
import { ItemTypesData } from '../../items/ItemTypesData'
import { memoize } from 'micro-memoize'
import { Msg } from '../../msg/Msg'
import { Input } from '../../components/ui/input'
import { Field, FieldLabel } from '../../components/ui/field'
import { useTranslations } from '../../msg/useTranslations'

interface UiFilter {
    subType: ItemSubType
    icon: Icons
    nameId: keyof Msg
}
const filtersType: UiFilter[] = [
    { subType: ItemSubType.Weapon, icon: Icons.Sword, nameId: 'Weapons' },
    { subType: ItemSubType.Armour, icon: Icons.Shield, nameId: 'Armours' },
    { subType: ItemSubType.Tool, icon: Icons.Pickaxe, nameId: 'Tools' },
    { subType: ItemSubType.Crafting, icon: Icons.Bar, nameId: 'Crafting' },
    { subType: ItemSubType.Potion, icon: Icons.Potion, nameId: 'Consumables' },
]
interface UiTypeFilter {
    type: ItemTypes
    icon: Icons
    name: string
}
const getItemTypesForSubType: (subType: ItemSubType) => UiTypeFilter[] = memoize(
    (subType: ItemSubType) => {
        return (Object.keys(ItemTypes) as Array<keyof typeof ItemTypes>)
            .filter((key) => getItemSubType(ItemTypes[key]) === subType)
            .map((key) => ({
                type: ItemTypes[key],
                icon: ItemTypesData[key].icon,
                name: ItemTypesData[key].nameId,
            }))
    },
    { maxSize: 100 }
)
export const ItemFilters = memo(function ItemFilters() {
    return (
        <Card>
            <CardContent className="flex flex-col gap-1">
                <ItemFilterSubType />
                <ItemFilterType />
                <ItemSearch />
            </CardContent>
        </Card>
    )
})
export const ItemFilterSubType = memo(function ItemFilterSubType() {
    const itemFilter = useGameStore(selectItemFilterSubType)

    return (
        <div className="flex items-center space-x-2">
            {filtersType.map((filter) => (
                <UIFilterType
                    key={filter.subType}
                    title={filter.nameId}
                    icon={filter.icon}
                    pressed={itemFilter === filter.subType}
                    onClick={(pressed) => setItemFilterSubType(pressed ? filter.subType : undefined)}
                />
            ))}
        </div>
    )
})
export const ItemFilterType = memo(function ItemFilterType() {
    const itemFilter = useGameStore(selectItemFilterSubType)
    const itemFilterType = useGameStore(selectItemFilterType)
    const typesData = itemFilter ? getItemTypesForSubType(itemFilter) : []

    return (
        <div className="flex items-center space-x-2">
            {typesData.map((filter) => (
                <UIFilterType
                    key={filter.type}
                    title={filter.name}
                    icon={filter.icon}
                    pressed={itemFilterType === filter.type}
                    onClick={(pressed) => setItemFilterType(pressed ? filter.type : undefined)}
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
        <Toggle
            aria-label={title}
            title={title}
            // size={'lg'}
            pressed={pressed}
            variant={'primary'}
            onPressedChange={onClick}
        >
            {IconsData[icon]}
        </Toggle>
    )
})

const onChange = (e: ChangeEvent<HTMLInputElement>) => setItemFilterSearch(e.target.value)
export const ItemSearch = memo(function ItemSearch() {
    const itemFilterSearch = useGameStore(selectItemFilterSearch)
    const { t } = useTranslations()

    return (
        <Field>
            <FieldLabel htmlFor="SearchItem">{t.SearchItem}</FieldLabel>
            <Input id="SearchItem" autoComplete="off" value={itemFilterSearch} onChange={onChange} />
        </Field>
    )
})
