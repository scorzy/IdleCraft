import { RecipeTypes } from '../../crafting/RecipeInterfaces'
import { CommaTypes } from '../../formatters/CommaTypes'
import { NotationTypes } from '../../formatters/NotationTypes'
import { GameLocations } from '../../gameLocations/GameLocations'
import { GatheringZone } from '../../gathering/gatheringZones'
import { ItemSubType, ItemTypes } from '../../items/Item'
import { OreTypes } from '../../mining/OreTypes'
import { WoodTypes } from '../../wood/WoodTypes'
import { VendorTypes } from '../../vendors/VendorTypes'
import { CollapsedEnum } from '../sidebar/CollapsedEnum'
import { UiPages } from './UiPages'

export interface UiState {
    open: boolean
    theme: string
    themeColor: string
    page: UiPages
    comma: CommaTypes
    numberFormatNotation: NotationTypes
    lang: string
    woodType: WoodTypes
    oreType: OreTypes
    marketItemId: string | null
    vendorType: VendorTypes
    gatheringZone: GatheringZone
    selectedItemId: string | null
    selectedItemLocation: GameLocations | null
    recipeType?: RecipeTypes
    storageOrder: 'name' | 'quantity' | 'value'
    storageAsc: boolean
    showAvailablePerks: boolean
    showUnavailablePerks: boolean
    showOwnedPerks: boolean
    battleZone: string | null
    selectedCharId: string
    collapsed: Partial<Record<CollapsedEnum, boolean>>
    defaultClosed: Record<string, boolean>
    deadDialog: boolean
    selectedQuestId: string | null
    selectedShipmentId: string | null
    itemFilterSubType: ItemSubType | undefined
    itemFilterType: ItemTypes | undefined
    itemFilterSearch: string
    selectedLocation: GameLocations
}
