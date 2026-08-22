import { convertVolume } from '../formatters/convertVolume'
import { splitTime } from '../formatters/splitTime'
import { FAST_SELLING_PERK, HIGH_PRICES_PERK } from '../market/MarketConst'
import {
    FAST_MINING_PERK,
    VEIN_MASTERY_ARMOUR_REDUCE,
    VEIN_MASTERY_GEM_BONUS,
    VEIN_MASTERY_HP_REDUCE,
    VEIN_MASTERY_QTA_BONUS,
} from '../mining/MiningCost'
import { QuestParams } from '../quests/QuestParams'
import { myMemoize } from '../utils/myMemoize'
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
    World: 'World',
    Travel: 'Travel',
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
    Volume: 'Volume',
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
    PersuasionExp: 'Persuasion Level',
    Ore: 'Ore',
    Gem: 'Gem',
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
    IncreaseGrowSpeed: 'Growth time',
    MiningTime: 'Mining Time',
    MiningDamage: 'Mining Damage',
    SearchOreVein: 'Search Ore Vein',
    OreVeins: 'Ore Veins',
    VeinArmour: 'Vein Armour',
    VeinGemChance: 'Gem Chance',
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
    HealthRegen: 'Health Regen',
    StaminaRegen: 'Stamina Regen',
    ManaRegen: 'Mana Regen',

    FastWoodcuttingPerk: 'Faster Woodcutting',
    FastWoodcuttingPerkDesc: `Increase woodcutting speed by ${FAST_WOODCUTTING_PERK}%`,
    FastMiningPerk: 'Faster Mining',
    FastMiningPerkDesc: `Increase mining speed by ${FAST_MINING_PERK}%`,
    VeinMasteryPerk: 'Vein Mastery',
    VeinMasteryPerkDesc: `Discovered veins: +${VEIN_MASTERY_QTA_BONUS}% quantity, -${VEIN_MASTERY_HP_REDUCE}% hp, -${VEIN_MASTERY_ARMOUR_REDUCE}% armour, +${VEIN_MASTERY_GEM_BONUS}% gem chance`,
    ChargedAttackPerk: 'Charged Attack',
    ChargedAttackPerkDesc: 'Unlock Charged Attack',
    GrowSpeedMasteryPerk: 'Growth Mastery',
    GrowSpeedMasteryPerkDesc: 'Increase Boost Growth effect to +40% for 3 minutes and raise max stacks to 5',
    HighPricesPerk: 'Higher Prices',
    HighPricesPerkDesc: `Increase sale value by ${HIGH_PRICES_PERK}%`,
    FastSellingPerk: 'Faster Selling',
    FastSellingPerkDesc: `Reduce market selling time by ${FAST_SELLING_PERK}%`,

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
    Head: 'Head',
    Body: 'Body Armour',
    Hands: 'Hands',
    Feet: 'Feet',

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
    LoadFromIndexedDB: 'Load from IndexedDB',
    ImportSave: 'Import Save',
    ExportSave: 'Export Save',
    ExportSaveDesc: 'Copy this string or download it as a file to keep a backup.',
    ImportSaveDesc: 'Paste a valid save string to import it into the game.',
    CopyToClipboard: 'Copy to Clipboard',
    DownloadFile: 'Download file',
    SaveExportError: 'Export failed',
    SaveImportError: 'Import failed',
    NoSavesFound: 'No saves found in IndexedDB.',
    Processing: 'Processing...',
    Size: 'Size',

    //  Smithing
    Dagger: 'Dagger',
    TwoHSword: '2H Sword',
    Helmet: 'Helmet',
    Gauntlets: 'Gauntlets',
    Boots: 'Boots',
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
    travelConfirmTitle: 'Are you sure you want to travel?',
    travelConfirmDesc: 'All current activities will be removed.',
    Travelling: 'Travelling...',
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
    UnknownPotion: 'Unknown Potion',
    HealthPotion: 'Health Potion',
    ManaPotion: 'Mana Potion',
    StaminaPotion: 'Stamina Potion',
    RegenHealthPotion: 'Health Regeneration Potion',
    RegenManaPotion: 'Mana Regeneration Potion',
    RegenStaminaPotion: 'Stamina Regeneration Potion',
    MaxHealthPotion: 'Maximum Health Potion',
    MaxManaPotion: 'Maximum Mana Potion',
    MaxStaminaPotion: 'Maximum Stamina Potion',
    DamageHealthPotion: 'Health Poison',
    DamageManaPotion: 'Mana Poison',
    DamageRegenHealthPotion: 'Lingering Health Poison',
    DamageRegenManaPotion: 'Lingering Mana Poison',
    DamageRegenStaminaPotion: 'Lingering Stamina Poison',
    Solvent: 'Solvent',
    Flask: 'Flask',
    Ingredient: 'Ingredient',
    OppositeEffects: 'Opposite Effects',
    MultipleEffects: 'Multiple Effects',
    IngredientsStability: 'Ingredients Stability',
    Alchemy: 'Alchemy',
    Stability: 'Stability',

    GlassFlask: 'Glass Flask',
    Water: 'Water',

    RedFlower: 'Red Flower',
    GreenFlower: 'Green Flower',
    BlueFlower: 'Blue Flower',
    Ruby: 'Ruby',
    Sapphire: 'Sapphire',
    Emerald: 'Emerald',

    Restore: 'Restore',
    RegenHealth: 'Regen Health',
    RegenMana: 'Regen Mana',
    RegenStamina: 'Regen Stamina',
    DamageHealth: 'Damage Health',
    DamageMana: 'Damage Mana',
    DamageStamina: 'Damage Stamina',
    DamageRegenHealth: 'Damage Regen Health',
    DamageRegenMana: 'Damage Regen Mana',
    DamageRegenStamina: 'Damage Regen Stamina',
    RestoreHealth: 'Restore Health',
    RestoreMana: 'Restore Mana',
    RestoreStamina: 'Restore Stamina',

    CraftingIngredient: 'Ingredient',
    AlchemyIngredient: 'Alchemy Ingredient:',
    UnknownProperty: 'Unknown Property',

    LowStabilityNotCraftable: 'Not Craftable',
    LowStabilityNotCraftableDesc: 'Stability is too low.',

    Lv: 'Lv.',
    Drops: 'Drops',

    IncreaseMaxHealthBy: 'Increase max health by',
    IncreaseMaxManaBy: 'Increase max mana by',
    IncreaseMaxStaminaBy: 'Increase max stamina by',
    IncreaseMaxHealthBy2: '',
    IncreaseMaxManaBy2: '',
    IncreaseMaxStaminaBy2: '',
    IncreaseMaxHealth: 'Increase max health',
    IncreaseMaxMana: 'Increase max mana',
    IncreaseMaxStamina: 'Increase max stamina',
    PerSecFor: 'per sec for',
    PerSec: 'per sec',

    Stable: 'Stable',
    Unstable: 'Unstable',
    Chaotic: 'Chaotic',
    Unknown: 'Unknown',

    NormalPotionDesc: 'Normal potion.',
    UnstablePotionDesc: 'Reduced efficiency.',
    ChaoticPotionDesc: 'Reduced efficiency and less effects.',
    UnknownPotionDesc: 'Unknown potion.',

    startVillageName: 'Start Village',
    startVillageDesc: 'Peaceful village surrounded by nature.',
    woodVillageName: 'Wood Village',
    woodVillageDesc: 'A village built among thriving forests, rich with lumber.',
    capitalCityName: 'Capital City',
    capitalCityDesc: 'A busy seat of power where merchants, guilds, and contracts shape every trade.',
    mountainVillageName: 'Mountain Village',
    mountainVillageDesc: 'A hardy settlement built beneath rich peaks and deep mining tunnels.',
    testName: 'testName',
    testDesc: 'testDesc',

    treeGrowBoostName: 'Tree Grow Boost',
    treeGrowBoostDesc: 'Tree grow speed',
    maxTreeName: 'Max Tree Boost',
    maxTreeDesc: 'Max trees',
    marketSaleValueBoostName: 'Market Sale Value Boost',
    marketSaleValueBoostDesc: 'Market sale value',
    marketTimeBoostName: 'Market Time Boost',
    marketTimeBoostDesc: 'Market time',
    oreVeinSearchTimeBoostName: 'Ore Vein Search Time Boost',
    oreVeinSearchTimeBoostDesc: 'Ore vein search time',
    oreVeinQuantityBoostName: 'Ore Vein Quantity Boost',
    oreVeinQuantityBoostDesc: 'Ore vein quantity',
    maxOreVeinsBoostName: 'Max Ore Veins Boost',
    maxOreVeinsBoostDesc: 'Max ore veins',

    Use: 'Use',

    TestSupplyQuest: 'Test Supply Quest',
    TestSupplyQuestDesc: 'Test Supply Quest',

    Chicken: 'Chicken',
    DeadChicken: 'Dead Chicken',

    RedMeat: 'Red Meat',
    WhiteMeat: 'White Meat',

    VitalHerb: 'Vital Herb',
    ManaBloom: 'Mana Bloom',
    StaminaLeaf: 'Stamina Leaf',
    HealingFungus: 'Healing Fungus',
    ManaSpore: 'Mana Spore',
    BitterRoot: 'Bitter Root',
    Nightshade: 'Nightshade',
    DamageStaminaPotion: 'Stamina Poison',
    FarmBoarTutorialName: 'Boars at the Family Farm',
    FarmBoarTutorialDescription:
        "Boars are destroying your family's crops. Choose one of three ways to solve the problem.",
    FarmBoarHuntTitle: 'Defend the farm',
    FarmBoarHuntDescription:
        'Kill 10 boars. Suggested preparation: craft at least a copper dagger, the weakest available metal, and copper body armour.',
    FarmBoarFenceTitle: 'Build a fence',
    FarmBoarFenceDescription: 'Deliver 30 logs so the family can build a sturdy fence around the fields.',
    FarmBoarRepellentTitle: 'Create a repellent',
    FarmBoarRepellentDescription:
        'Gather alchemical ingredients, then brew and deliver 3 poison potions with the Damage Stamina effect.',
    HeartCrystalDust: 'Heart Crystal Dust',
    ManaCrystalDust: 'Mana Crystal Dust',
    UnknownEffects: 'Unknown Effects, potion may have unexpected results',
    RemoveWhenCompleted: 'Remove when completed',
    RemoveOthers: 'Remove other activities',
    Repetitions: 'Repetitions',
    AddLast: 'Last',
    AddFirst: 'First',
    AddBeforeCurrent: 'Before current',
    AddAfterCurrent: 'Next',
    StartActNow: 'Start now',
    AddOptions: 'Add activity options',
    WolfLair: 'Wolf Lair',
    KillToUnlock: 'Kill to unlock',
    Weapons: 'Weapons',
    Armours: 'Armours',
    Others: 'Others',
    Tools: 'Tools',
    Consumables: 'Consumables',
    SearchItem: 'Search',
    Cuisses: 'Cuisses',
    Legs: 'Legs',
    UnlockGathering: 'Unlock this gathering zone to start gathering here.',
    UnlockGathering1: 'Requires gathering level ',
    UnlockGathering2: ' and completion of the related quest.',

    Caravans: 'Caravans',
    NewCaravan: 'New Caravan',
    Destination: 'Destination',
    CaravanTier: 'Caravan',
    CaravanHeavyCart: 'Heavy Cart',
    CaravanStandard: 'Caravan',
    CaravanFastCourier: 'Fast Courier',
    Cargo: 'Cargo',
    LoadAllStorage: 'Load all storage',
    Dispatch: 'Dispatch',
    InTransit: 'In transit',
    Returning: 'Returning',
    Recall: 'Recall',
    recallConfirmTitle: 'Recall this caravan?',
    recallConfirmDesc: 'The caravan will turn back. The gold already spent will not be refunded.',
    Duration: 'Duration',
    TotalCost: 'Total cost',
    TotalVolume: 'Total volume',
    From: 'From',
    To: 'To',
    NoActiveShipments: 'No caravans in transit.',
    ArrivesIn: 'Arrives in',
    AvailableSlots: 'Available slots',
    NotEnoughCargo: 'Not enough cargo in storage',
    NotEnoughGold: 'Not enough gold',
    NoFreeSlots: 'No caravan slots available',
    SelectDestination: 'Select a destination',
    SelectTier: 'Select a caravan',
    NoDestinations: 'No reachable destinations from here.',
    AddToCaravan: 'Add to caravan',
    AlreadyInCargo: 'In cargo:',
    TimeRemaining: 'Time remaining',
    Arrived: 'Arrived',
    AddAll: 'Add all',

    Market: 'Market',
    MarketUnknownItem: 'Unknown item',
    MarketTime: 'Time',
    SaleValue: 'Value',
    PersuasionBonus: 'Persuasion',
    SelectItem: 'Select an item',
    Sell: 'Sell',
    SellAll: 'Sell all',
    QuickSell: 'Quick Sell',

    Vendors: 'Vendors',
    GeneralMerchant: 'General merchant',
    Blacksmith: 'Blacksmith',
    Alchemist: 'Alchemist',
    UnlimitedStock: 'Unlimited stock',
    UnitPrice: 'Unit price',
    Buy: 'Buy',

    Error: 'Error',
    IndexedDbNotFound: 'indexedDB not found, please check your browser permission',
    ToggleTheme: 'Toggle theme',
    ThemeLight: 'Light',
    ThemeDark: 'Dark',
    ThemeSystem: 'System',
    ThemeZinc: 'Zinc',
    ThemeBlue: 'Blue',
    ThemeGreen: 'Green',
    ThemeViolet: 'Violet',
    SkillRotation: 'Skill Rotation',
    Equip: 'Equip',
    MainHand: 'Main Hand',
    TwoHand: 'Two Hands',
    Common: 'Common',
    Uncommon: 'Uncommon',
    Rare: 'Rare',
    SaveStringEmpty: 'Save string is empty',
    SaveFileTooLarge: 'File too large. Max size is 5MB',
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
            let negative = false
            if (time < 0) {
                time = time * -1
                negative = true
            }
            const split = splitTime(time)
            if (split.years > 0) return years(split.years)
            if (split.months > 0) return months(split.months)
            if (split.days > 0) return days(split.days)
            if (split.hours > 0) return h(split.hours)
            if (split.minutes > 0) return m(split.minutes)
            if (split.seconds >= 10) return s(Math.floor(split.seconds))
            if (split.seconds > 10) return s(Math.floor(split.seconds))
            return (negative ? '-' : '') + s(Math.floor(split.seconds * 10) / 10)
        },
        formatTimePrecise: (time: number) => {
            let negative = false
            if (time < 0) {
                time = time * -1
                negative = true
            }
            const split = splitTime(time)
            if (split.years > 0) return years(split.years)
            if (split.months > 0) return months(split.months)
            if (split.days > 0) return `${days(split.days)} ${h(split.hours)}`
            if (split.hours > 0) return `${h(split.hours)} ${m(split.minutes)}`
            if (split.minutes > 0) return `${m(split.minutes)} ${s(Math.floor(split.seconds))}`
            if (split.seconds >= 10) return s(Math.floor(split.seconds))
            if (split.seconds > 10) return s(Math.floor(split.seconds))
            return (negative ? '-' : '') + s(Math.floor(split.seconds * 10) / 10)
        },
        formatVolume: myMemoize((volumeM3: number) => {
            const { value, unit } = convertVolume(volumeM3)
            return `${f(value)} ${unit}`
        }),

        //
        cutting: (woodName: keyof Msg) => `Cutting ${msg[woodName]}`,
        boostTree: (woodName: keyof Msg) => `Boost ${msg[woodName]} Grow Speed`,
        crafting: (itemName: string) => `Crafting ${itemName}`,
        mining: (oreNameId: keyof Msg) => `Mining ${msg[oreNameId]}`,
        selling: (itemName: string) => `Selling ${itemName}`,
        speedBonusPercent: (bonus: string) => `Speed bonus +${bonus}%`,
        prestigePercent: (bonus: string) => `Value bonus +${bonus}%`,
        fighting: (enemy: keyof Msg) => `Fighting ${msg[enemy]}`,
        requireWoodcuttingLevel: (formattedQta: string) => `Require woodcutting level ${formattedQta}`,
        requireMiningLevel: (formattedQta: string) => `Require mining level ${formattedQta}`,

        OreVein: (oreName: string) => `${oreName} Vein`,

        testQuestName: (_questParams: QuestParams) => 'Kill or Collect',
        testQuestDesc: (_questParams: QuestParams) => 'Kill or Collect, debug quest',
        testOutcomeDesc: (_questParams: QuestParams) => 'Kill some boars',
        testOutcome2Desc: (_questParams: QuestParams) => 'Collect some items',

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
        UnlockQuest: (zone: keyof Msg) => `Unlock ${msg[zone]} Gathering Zone`,
        KillToUnlock: (enemy: keyof Msg) => `Kill ${msg[enemy]} to unlock`,
        ZoneUnlocked: (zone: keyof Msg) => `Zone ${msg[zone]} Unlocked`,
    }
}
