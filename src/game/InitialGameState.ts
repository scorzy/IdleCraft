import { ActivityAdapter } from '../activities/ActivityState'
import { CommaTypes } from '../formatters/CommaTypes'
import { NotationTypes } from '../formatters/NotationTypes'
import { GameLocations } from '../gameLocations/GameLocations'
import { OreTypes } from '../mining/OreTypes'
import { ItemAdapter } from '../storage/ItemAdapter'
import { TimerAdapter } from '../timers/Timer'
import { UiPages } from '../ui/state/UiPages'
import { WoodTypes } from '../wood/WoodTypes'
import { TreeGrowthAdapter } from '../wood/forest/forestGrowth'
import { GrowSpeedBonusAdapter } from '../wood/forest/growSpeedBonus'
import { PLAYER_CHAR, PLAYER_ID } from '../characters/charactersConst'
import { CastCharAbilityAdapter } from '../activeAbilities/abilityAdapters'
import { BattleLogAdapter } from '../battleLog/battleLogAdapter'
import { RecipeTypes } from '../crafting/RecipeInterfaces'
import { QuestAdapter } from '../quests/QuestTypes'
import { StorageAdapter } from '../storage/storageAdapter'
import { AppliedEffectAdapter } from '../effects/types/AppliedEffect'
import { GatheringSubZone } from '../gathering/gatheringZones'
import { InitialGatheringZoneProgress } from '../gathering/gatheringData'
import { AddActivityTypes, GameState, LocationState } from './GameState'

const getInitialVillageState: () => LocationState = () => {
    return {
        storage: StorageAdapter.getInitialState(),
        forests: {},
        ores: {},
        oreVeins: {},
        loot: [],
    }
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
        selectedItemId: null,
        selectedItemLocation: null,
        storageOrder: 'name',
        storageAsc: true,
        oreType: OreTypes.Copper,
        gatheringZone: GatheringSubZone.ForestNormal,
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
    locations: {
        [GameLocations.StartVillage]: getInitialVillageState(),
        [GameLocations.Test]: getInitialVillageState(),
    },
    treeGrowth: TreeGrowthAdapter.getInitialState(),
    growSpeedBonuses: GrowSpeedBonusAdapter.getInitialState(),
    recipeId: '',
    craftingForm: {
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
    discoveredEffects: {},
    effects: AppliedEffectAdapter.getInitialState(),
    addActType: AddActivityTypes.Last,
    removeOtherActivities: false,
    startActNow: false,
    actRepetitions: 1,
    actAutoRemove: false,
    gatheringZones: structuredClone(InitialGatheringZoneProgress),
    requirementProgress: {
        kills: {},
        consumed: {},
        delivered: {},
    },
}

export const GetInitialGameState: () => GameState = () => structuredClone(InitialGameState)
