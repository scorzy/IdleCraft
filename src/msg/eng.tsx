import { splitTime } from '../formatters/splitTime'
import { FAST_MINING_PERK } from '../mining/MiningCost'
import { QuestParams } from '../quests/QuestParams'
import { sameNumber } from '../utils/sameNumber'
import { FAST_WOODCUTTING_PERK } from '../wood/WoodConst'
import { GetItemNameParams } from './GetItemNameParams'
import { Msg } from './Msg'
import { MsgFunctions } from './MsgFunctions'
import { selectPrimaryMaterialName } from './selectors/selectPrimaryMaterialName'

export const engMsg: Msg = {
    LevelToLow: 'Level to low',
    Activities: 'Activities',
    Abilities: 'Abilities',
    Storage: 'Storage',
    Woodcutting: 'Woodcutting',
    Woodworking: 'Woodworking',
    Time: 'Time',
    Stop: 'Stop',
    Info: 'Info',
    Add: 'Add',
    Points: 'Points',
    Loading: 'Loading...',
    StartNow: 'Start Now',
    Ago: 'ago',
    Fight: 'Fight',
    CraftingUnknown: 'Crafting ??',
    DeadTree: 'Dead Tree',
    Oak: 'Oak',
    DeadTreeForest: 'Dead Tree Forest',
    OakForest: 'Oak Forest',
    Cutting: 'Cutting',
    TreeHP: 'Tree HP',
    Cut: 'Cut',
    Trees: 'Trees',
    GrowingTrees: 'Growing Trees',
    MoveUp: 'Move Up',
    MoveDown: 'Move Down',
    Remove: 'Remove',
    Log: 'Log',
    None: 'None',
    Recipe: 'Recipe',
    Plank: 'Plank',
    Requirements: 'Requirements',
    NoItems: "You don't possess anything!",
    NoActivities: "There aren't any activity",
    Craft: 'Craft',
    Sort: 'Sort',
    Name: 'Name',
    Quantity: 'Quantity',
    Value: 'Value',
    Handle: 'Handle',
    DeadTreeHandle: 'Dead Tree Handle',
    OakHandle: 'Oak Handle',
    Mining: 'Mining',
    OreHp: 'Ore Hp',
    Mine: 'Mine',
    OreQta: 'Quantity',
    Level: 'Level',
    XP: 'XP',
    MiningExp: 'Mining Level',
    WoodcuttingExp: 'Woodcutting Level',
    WoodworkingExp: 'Woodworking Level',
    SmithingExp: 'Smithing Level',
    Ore: 'Ore',
    Bar: 'Bar',
    Smithing: 'Smithing',

    Crafting: 'Crafting',
    Gathering: 'Gathering',
    ItemType: 'Type',
    Damage: 'Damage',
    AttackSpeed: 'Attack Speed',
    ArmourPen: 'Armour Pen.',
    WoodcuttingDamage: 'Woodcutting Damage',
    WoodcuttingTime: 'Woodcutting  Time',
    MiningTime: 'Mining Time',
    MiningDamage: 'Mining Damage',
    SelectARecipe: 'Select a recipe',
    // Perks
    Perks: 'Perks',
    Available: 'Available',
    NotAvailable: 'Not Available',
    Completed: 'Owned',
    Select: 'Select',
    Base: 'Base',
    Total: 'Total',
    Used: 'Used',
    Filter: 'Filter',
    Attributes: 'Attributes',
    healthPoints: 'Health Points',
    StaminaPoints: 'Stamina Points',
    ManaPoints: 'Mana Points',
    Health: 'Health',
    Stamina: 'Stamina',
    Mana: 'Mana',

    FastWoodcuttingPerk: 'Faster Woodcutting',
    FastWoodcuttingPerkDesc: `Increase woodcutting speed by ${FAST_WOODCUTTING_PERK}%`,
    FastMiningPerk: 'Faster Mining',
    FastMiningPerkDesc: `Increase mining speed by ${FAST_MINING_PERK}%`,
    ChargedAttackPerk: 'Charged Attack',
    ChargedAttackPerkDesc: 'Unlock Charged Attack',

    ActivityAdded: 'Activity added',
    NormalAttack: 'Normal Attack',
    NormalAttackDesc: 'Normal Attack',

    ChargedAttack: 'Charged Attack',
    ChargedAttackDesc: 'Charged Attack',

    CombatZones: 'Combat Zones',
    Characters: 'Characters',

    // battle
    Forest: 'Forest',
    Boar: 'Boar',
    Wolves: 'Wolves',
    Combat: 'Combat',
    Pickaxe: 'Pickaxe',

    Unharmed: 'Unharmed',

    Stats: 'Stats',

    BludgeoningArmour: 'Bludgeoning Armour',
    BludgeoningDamage: 'Bludgeoning Damage',
    PiercingArmour: 'Piercing Armour',
    PiercingDamage: 'Piercing Damage',
    SlashingArmour: 'Slashing Armour',
    SlashingDamage: 'Slashing Damage',

    OneHand: 'Main Hand',
    TwoHands: 'Two Hands',
    Body: 'Body Armour',

    DamageType: 'Damage Type',
    Defence: 'Defence',
    Attack: 'Attack',
    Equipments: 'Equipments',
    YouDied: 'You died',

    Archery: 'Archery',
    OneHanded: 'One Handed',
    TwoHanded: 'Two Handed ',
    Block: 'Block',

    Skills: 'Skills',
    Start: 'Start',
    NewGame: 'New Game',
    Delete: 'Delete',
    SavedGames: 'Saved Games',

    //  Smithing
    Dagger: 'Dagger',
    TwoHSword: '2H Sword',
    LongSword: 'Long Sword',
    WoodAxe: 'Wood Axe',
    Armour: 'Armour',

    OffensiveInfo: 'Offensive Info',
    DefensiveInfo: 'Defensive Info',

    Allies: 'Allies',
    Enemies: 'Enemies',

    Empty: 'Empty',
    FilterDots: 'Filter...',
    Battle: 'Battle',

    DeadBoar: 'Dead Boar',
    Loot: 'Loot',
    Collect: 'Collect',

    Corpse: 'Corpse',
    Butchering: 'Butchering',

    BoarMeat: 'Boar Meat',
    BoarSkin: 'Boar Skin',
    ButcheringExp: 'Butchering Level',

    Results: 'Results',
    YouHave: 'you have',

    RawFood: 'Raw Food',
    RawSkin: 'Raw Skin',
    Wolf: 'Wolf',
    DeadWolf: 'Dead Wolf',

    BattleStarted: 'Battle started',
    BattleFinished: 'Battle finished',

    Killed: 'Killed',
    Quests: 'Quests',

    BoarQuest1: 'Boar Quest 1',
    BoarQuest1Desc: 'Kill 5 Boars',

    AcceptedQuests: 'Accepted Quests',
    AvailableQuests: 'Available Quests',

    Complete: 'Complete',
    Accept: 'Accept',
    Gold: 'Gold',

    KillRequestDesc: 'Kill the following targets:',
    collectReqDesc: 'Collect the following items',

    Rewards: 'Rewards',
    items: 'items',
    with1: 'with',
    withProps: 'with the following properties:',

    highPriority: 'Hight Priority',
    mediumPriority: 'Medium Priority',
    lowPriority: 'Low Priority',
    selectPlaceholder: '-- Select --',

    collectConsume: 'The following items will be consumed: ',
    deleteSaveTitle: 'Are you absolutely sure?',
    deleteSaveDesc: 'This action cannot be undone. This will permanently delete your save',
    cancel: 'Cancel',
    Active: 'Active',
    InQueue: 'In Queue',

    BoarTusk: 'Boar Tusk',

    NoResults: 'No results found.',
    Close: 'Close',

    CopperMat: 'Copper',
    TinMat: 'Tin',
    DeadWoodMat: 'Dead Wood',
    OakMat: 'Oak',
    Potion: 'Potion',
    Solvent: 'Solvent',
    Flask: 'Flask',
    Ingredient: 'Ingredient',
    OppositeEffects: 'Opposite Effects',
    MultipleEffects: 'Multiple Effects',
    IngredientsStability: 'Ingredients Stability',
    Alchemy: 'Alchemy',
    Stability: 'Stability',
}

export const makeEngMsg: (msg: Msg, f: (value: number) => string) => MsgFunctions = (
    msg: Msg,
    f: (value: number) => string
) => {
    const years = (qta: number) => `${f(qta)} ${qta === 1 ? 'year' : 'years'}`
    const months = (qta: number) => `${f(qta)} ${qta === 1 ? 'month' : 'months'}`
    const days = (qta: number) => `${f(qta)} ${qta === 1 ? 'day' : 'days'}`
    const h = (qta: number) => `${f(qta)}h`
    const m = (qta: number) => `${f(qta)}m`
    const s = (qta: number) => `${f(qta)}s`

    return {
        years,
        months,
        days,
        h,
        m,
        s,
        formatTime: (time: number) => {
            const split = splitTime(time)
            if (split.years > 0) return years(split.years)
            if (split.months > 0) return months(split.months)
            if (split.days > 0) return days(split.days)
            if (split.hours > 0) return h(split.hours)
            if (split.minutes > 0) return m(split.minutes)
            if (split.seconds >= 10) return s(Math.floor(split.seconds))
            if (split.seconds > 10) return s(Math.floor(split.seconds))
            return s(Math.floor(split.seconds * 10) / 10)
        },
        formatTimePrecise: (time: number) => {
            const split = splitTime(time)
            if (split.years > 0) return years(split.years)
            if (split.months > 0) return months(split.months)
            if (split.days > 0) return `${days(split.days)} ${h(split.hours)}`
            if (split.hours > 0) return `${h(split.hours)} ${m(split.minutes)}`
            if (split.minutes > 0) return `${m(split.minutes)} ${s(Math.floor(split.seconds))}`
            if (split.seconds >= 10) return s(Math.floor(split.seconds))
            if (split.seconds > 10) return s(Math.floor(split.seconds))
            return s(Math.floor(split.seconds * 10) / 10)
        },

        //
        cutting: (woodName: keyof Msg) => `Cutting ${msg[woodName]}`,
        crafting: (itemName: string) => `Crafting ${itemName}`,
        mining: (oreNameId: keyof Msg) => `Mining ${msg[oreNameId]}`,
        speedBonusPercent: (bonus: string) => `Speed bonus +${bonus}%`,
        prestigePercent: (bonus: string) => `Value bonus +${bonus}%`,
        fighting: (enemy: keyof Msg) => `Fighting ${msg[enemy]}`,
        requireWoodcuttingLevel: (formattedQta: string) => `Require woodcutting level ${formattedQta}`,
        requireMiningLevel: (formattedQta: string) => `Require mining level ${formattedQta}`,

        OreVein: (oreName: string) => `${oreName} Vein`,

        testQuestName: (_questParams: QuestParams) => 'testQuestName',
        testQuestDesc: (_questParams: QuestParams) => 'testQuestDesc',
        testOutcomeDesc: (_questParams: QuestParams) => 'testOutcomeDesc',
        testOutcome2Desc: (_questParams: QuestParams) => 'testOutcome2Desc',

        collectN: (n: number) => `Collect ${f(n)}`,

        collectItemsTotal: (n: number) => {
            if (n < Number.EPSILON) return "You don't have any item that can be used to complete the quest"
            if (sameNumber(n, 1)) return 'You have one item that can be used to complete the quest'
            return `You have ${f(n)} items that can be used to complete the quest`
        },

        getItemName: (params: GetItemNameParams) => {
            let name = msg[params.itemNameId] || params.itemNameId

            if (params.materials) {
                const primaryMatId = selectPrimaryMaterialName(params.materials)
                if (primaryMatId) name = `${msg[primaryMatId]} ${name}`
            }
            return name
        },
    }
}
