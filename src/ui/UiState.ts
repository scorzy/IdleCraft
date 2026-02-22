import { RecipeTypes } from '../crafting/RecipeInterfaces'
import { CommaTypes } from '../formatters/CommaTypes'
import { NotationTypes } from '../formatters/NotationTypes'
import { GameLocations } from '../gameLocations/GameLocations'
import { WoodTypes } from '../wood/WoodTypes'
import { OreTypes } from '../mining/OreTypes'
import { GatheringZone } from '../gathering/gatheringZones'
import { UiPages } from './state/UiPages'
import { CollapsedEnum } from './sidebar/CollapsedEnum'

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
}
