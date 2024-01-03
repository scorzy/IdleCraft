import { ActivityAdapter } from '../activities/ActivityState'
import { CraftingAdapter } from '../crafting/CraftingAdapter'
import { CommaTypes } from '../formatters/CommaTypes'
import { NotationTypes } from '../formatters/NotationTypes'
import { GameLocations } from '../gameLocations/GameLocations'
import { MiningAdapter } from '../mining/MiningAdapter'
import { OreTypes } from '../mining/OreTypes'
import { ItemAdapter } from '../storage/ItemAdapter'
import { TimerAdapter } from '../timers/Timer'
import { UiPages } from '../ui/state/UiPages'
import { WoodTypes } from '../wood/WoodTypes'
import { WoodcuttingAdapter } from '../wood/WoodcuttingAdapter'
import { TreeGrowthAdapter } from '../wood/forest/forestGrowth'
import { PLAYER_ID } from '../characters/charactersConst'
import { PerksEnum } from '../perks/perksEnum'
import { BattleAdapter } from '../battle/BattleAdapter'
import { CharAbilityAdapter } from '../activeAbilities/CharAbilityAdapter'
import { Icons } from '../icons/Icons'
import { GameState, LocationState } from './GameState'

const InitialVillageState: () => LocationState = () =>
    structuredClone({
        storage: {
            StdItems: {},
            CraftedItems: {},
        },
        forests: {},
        ores: {},
    })

export const InitialGameState: GameState = {
    gameId: '',
    ui: {
        open: false,
        theme: 'system',
        themeColor: '',
        page: UiPages.Storage,
        comma: CommaTypes.AUTO,
        lang: 'eng',
        numberFormatNotation: NotationTypes.STANDARD,
        woodType: WoodTypes.DeadTree,
        selectedStdItemId: null,
        selectedCraftedItemId: null,
        selectedItemLocation: null,
        storageOrder: 'name',
        storageAsc: true,
        oreType: OreTypes.Copper,
        sidebarCollapsed: false,
        gatheringCollapsed: false,
        craftingCollapsed: false,
        perk: PerksEnum.FAST_WOODCUTTING,
        showAvailablePerks: true,
        showOwnedPerks: true,
        showUnavailablePerks: true,
        battleZone: null,
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
    woodcutting: WoodcuttingAdapter.getInitialState(),
    waitingTrees: null,
    locations: { [GameLocations.StartVillage]: InitialVillageState(), [GameLocations.Test]: InitialVillageState() },
    treeGrowth: TreeGrowthAdapter.getInitialState(),
    crafting: CraftingAdapter.getInitialState(),
    recipeId: '',
    mining: MiningAdapter.getInitialState(),
    perks: {},
    craftingForm: {
        params: [],
        paramsValue: [],
        result: undefined,
    },
    characters: {
        ids: [PLAYER_ID],
        entries: {
            [PLAYER_ID]: {
                iconId: Icons.Axe,
                nameId: 'Activities',
                id: PLAYER_ID,
                inventory: {},
                exp: 0,
                level: 0,
                healthPoints: 0,
                manaPoints: 0,
                staminaPoints: 0,
                isEnemy: false,
                skillsExp: {},
                skillsLevel: {},
                combatAbilities: [],
                allCombatAbilities: CharAbilityAdapter.getInitialState(),
                health: 100,
                mana: 100,
                stamina: 100,
                lastCombatAbilityNum: 0,
                lastCombatAbilityId: null,
            },
        },
    },
    battle: BattleAdapter.getInitialState(),
}

export const GetInitialGameState: () => GameState = () => structuredClone(InitialGameState)
