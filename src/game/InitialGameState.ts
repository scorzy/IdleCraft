import { CastCharAbilityAdapter } from '../activeAbilities/abilityAdapters'
import { ActivityAdapter } from '../activities/ActivityState'
import { BattleLogAdapter } from '../battleLog/battleLogAdapter'
import { DEFAULT_CARAVAN_SLOTS, ROUTE_CATEGORY_MINUTES, RouteCategory } from '../caravans/CaravanConst'
import { ShipmentAdapter } from '../caravans/ShipmentState'
import { PLAYER_CHAR, PLAYER_ID } from '../characters/charactersConst'
import { RecipeTypes } from '../crafting/RecipeInterfaces'
import { AppliedEffectAdapter } from '../effects/types/AppliedEffect'
import { CommaTypes } from '../formatters/CommaTypes'
import { NotationTypes } from '../formatters/NotationTypes'
import { GameLocationAdapter } from '../gameLocations/GameLocationAdapter'
import { GameLocations } from '../gameLocations/GameLocations'
import { LocationModifierAdapter, LocationModifierType } from '../gameLocations/modifiers/LocationModifier'
import { GatheringZone } from '../gathering/gatheringZones'
import { OreTypes } from '../mining/OreTypes'
import { QuestAdapter } from '../quests/QuestTypes'
import { ItemAdapter } from '../storage/ItemAdapter'
import { StorageAdapter } from '../storage/storageAdapter'
import { TimerAdapter } from '../timers/Timer'
import { UiPages } from '../ui/state/UiPages'
import { TreeGrowthAdapter } from '../wood/forest/forestGrowth'
import { GrowSpeedBonusAdapter } from '../wood/forest/growSpeedBonus'
import { WoodTypes } from '../wood/WoodTypes'
import { VendorTypes } from '../vendors/VendorTypes'
import { AddActivityTypes } from './GameState'
import type { GameState, LocationState } from './GameState'

const getInitialLocationModifiers = (id: GameLocations) => {
    const modifiers = LocationModifierAdapter.getInitialState()
    if (id === GameLocations.WoodVillage) {
        LocationModifierAdapter.create(modifiers, {
            id: 'WoodVillageTreeGrowBoost',
            type: LocationModifierType.TreeGrowBoost,
            multi: -10,
        })
        LocationModifierAdapter.create(modifiers, {
            id: 'WoodVillageMaxTree',
            type: LocationModifierType.MaxTree,
            multi: 40,
        })
    }
    if (id === GameLocations.CapitalCity) {
        LocationModifierAdapter.create(modifiers, {
            id: 'CapitalCityMarketSaleValue',
            type: LocationModifierType.MarketSaleValue,
            multi: 20,
        })
        LocationModifierAdapter.create(modifiers, {
            id: 'CapitalCityMarketTime',
            type: LocationModifierType.MarketTime,
            multi: -20,
        })
    }
    if (id === GameLocations.MountainVillage) {
        LocationModifierAdapter.create(modifiers, {
            id: 'MountainVillageOreVeinSearchTime',
            type: LocationModifierType.OreVeinSearchTime,
            multi: -20,
        })
        LocationModifierAdapter.create(modifiers, {
            id: 'MountainVillageMaxOreVeins',
            type: LocationModifierType.MaxOreVeins,
            multi: 2,
        })
        LocationModifierAdapter.create(modifiers, {
            id: 'MountainVillageOreVeinQuantity',
            type: LocationModifierType.OreVeinQuantity,
            multi: 50,
        })
    }
    return modifiers
}

const getInitialLocationState: (id: GameLocations) => LocationState = (id) => {
    return {
        id,
        caravanSlots: DEFAULT_CARAVAN_SLOTS,
        caravanRoutes:
            id === GameLocations.StartVillage
                ? [{ toId: GameLocations.WoodVillage, baseMinutes: ROUTE_CATEGORY_MINUTES[RouteCategory.Nearby] }]
                : id === GameLocations.WoodVillage
                  ? [{ toId: GameLocations.StartVillage, baseMinutes: ROUTE_CATEGORY_MINUTES[RouteCategory.Nearby] }]
                  : [],
        storage: StorageAdapter.getInitialState(),
        forests: {},
        ores: {},
        oreVeins: {},
        loot: [],
        unlockedGatheringZones: [],
        modifiers: getInitialLocationModifiers(id),
    }
}

const getInitialLocations = () => {
    const locations = GameLocationAdapter.getInitialState()
    GameLocationAdapter.create(locations, getInitialLocationState(GameLocations.StartVillage))
    GameLocationAdapter.create(locations, getInitialLocationState(GameLocations.WoodVillage))
    GameLocationAdapter.create(locations, getInitialLocationState(GameLocations.CapitalCity))
    GameLocationAdapter.create(locations, getInitialLocationState(GameLocations.MountainVillage))
    GameLocationAdapter.create(locations, getInitialLocationState(GameLocations.Test))
    return locations
}

export const InitialGameState: GameState = {
    gameId: '',
    isTimer: false,
    lastRegen: 0,
    gold: 0,
    ui: {
        open: false,
        theme: 'system',
        themeColor: '',
        page: UiPages.Storage,
        comma: CommaTypes.AUTO,
        lang: 'eng',
        numberFormatNotation: NotationTypes.STANDARD,
        woodType: WoodTypes.DeadTree,
        marketItemId: null,
        vendorType: VendorTypes.GeneralMerchant,
        selectedItemId: null,
        selectedItemLocation: null,
        storageOrder: 'name',
        storageAsc: true,
        oreType: OreTypes.Copper,
        gatheringZone: GatheringZone.Forest,
        showAvailablePerks: true,
        showOwnedPerks: true,
        showUnavailablePerks: true,
        battleZone: null,
        selectedCharId: PLAYER_ID,
        collapsed: {},
        defaultClosed: {},
        deadDialog: false,
        recipeType: RecipeTypes.Smithing,
        selectedQuestId: null,
        selectedShipmentId: null,
        itemFilterSubType: undefined,
        itemFilterType: undefined,
        itemFilterSearch: '',
        selectedLocation: GameLocations.StartVillage,
    },
    notifications: [],
    location: GameLocations.StartVillage,
    activities: ActivityAdapter.getInitialState(),
    orderedActivities: [],
    activityId: null,
    activityDone: 0,
    lastActivityDone: 0,
    timers: TimerAdapter.getInitialState(),
    now: Date.now(),
    loading: false,
    craftedItems: ItemAdapter.getInitialState(),
    waitingTrees: null,
    locations: getInitialLocations(),
    treeGrowth: TreeGrowthAdapter.getInitialState(),
    growSpeedBonuses: GrowSpeedBonusAdapter.getInitialState(),
    recipeId: '',
    craftingForm: {
        recipeGroup: undefined,
        params: [],
        paramsValue: [],
        result: undefined,
    },
    characters: {
        ids: [PLAYER_ID],
        entries: {
            [PLAYER_ID]: PLAYER_CHAR,
        },
    },
    castCharAbility: CastCharAbilityAdapter.getInitialState(),
    battleLogs: BattleLogAdapter.getInitialState(),
    quests: QuestAdapter.getInitialState(),
    completedQuestTemplates: [],
    discoveredEffects: {},
    effects: AppliedEffectAdapter.getInitialState(),
    addActType: AddActivityTypes.Last,
    removeOtherActivities: false,
    startActNow: false,
    actRepetitions: 1,
    actAutoRemove: false,
    shipments: ShipmentAdapter.getInitialState(),
    caravanDispatchForm: {
        toId: undefined,
        tierId: undefined,
        cargo: [],
    },
}

export const GetInitialGameState: () => GameState = () => structuredClone(InitialGameState)
