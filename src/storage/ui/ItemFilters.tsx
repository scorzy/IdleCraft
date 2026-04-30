import { memo } from 'react'

import { Card, CardContent } from '../../components/ui/card'
import { useGameStore } from '../../game/state'
import { selectitemFilterSubType } from '../../ui/state/uiSelectors'
import { Toggle } from '@/components/ui/toggle'
import { Icons, IconsData } from '../../icons/Icons'
import { setItemFilterSubType } from '../../ui/state/uiFunctions'
import { ItemSubType } from '../../items/Item'

interface UiFilter {
    subType: ItemSubType
    icon: Icons
    name: string
}

const filtersType: UiFilter[] = [
    { subType: ItemSubType.Weapon, icon: Icons.Sword, name: 'Weapons' },
    { subType: ItemSubType.Armour, icon: Icons.Shield, name: 'Armours' },
    { subType: ItemSubType.Tool, icon: Icons.Pickaxe, name: 'Tools' },
    { subType: ItemSubType.Crafting, icon: Icons.Bar, name: 'Crafting' },
    { subType: ItemSubType.Potion, icon: Icons.Potion, name: 'Consumables' },
]

export const ItemFilters = memo(function ItemFilters() {
    return (
        <Card>
            <CardContent>
                <ItemFilterSubType />
            </CardContent>
        </Card>
    )
})
export const ItemFilterSubType = memo(function ItemFilterSubType() {
    const itemFilter = useGameStore(selectitemFilterSubType)
    const selectedSubType = itemFilter?.itemSubType

    return (
        <div className="flex items-center space-x-2">
            {filtersType.map((filter) => (
                <Toggle
                    key={filter.subType}
                    aria-label={filter.name}
                    size={'lg'}
                    pressed={selectedSubType === filter.subType}
                    variant={selectedSubType === filter.subType ? 'primary' : 'default'}
                    onPressedChange={(pressed) =>
                        setItemFilterSubType(pressed ? { itemSubType: filter.subType } : undefined)
                    }
                >
                    {IconsData[filter.icon]}
                </Toggle>
            ))}
        </div>
    )
})
