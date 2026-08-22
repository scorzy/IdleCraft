export interface Msg {
    LevelToLow: string
    Activities: string
    Abilities: string
    Storage: string
    Woodcutting: string
    World: string
    Travel: string
    Time: string
    Stop: string
    MoveUp: string
    MoveDown: string
    Remove: string
    Level: string
    XP: string
    Crafting: string
    Gathering: string
    ItemType: string
    Info: string
    Stats: string
    SelectARecipe: string
    Add: string
    Points: string
    Loading: string
    StartNow: string
    Ago: string
    Fight: string

    CraftingUnknown: string
    Woodworking: string
    Log: string
    None: string
    Recipe: string
    Plank: string
    Requirements: string
    NoItems: string
    NoActivities: string
    Craft: string
    Sort: string
    Name: string
    Quantity: string
    Value: string
    Volume: string
    Handle: string
    Ore: string
    Gem: string
    Bar: string

    //  Trees
    Cutting: string
    TreeHP: string
    Cut: string
    Trees: string
    GrowingTrees: string
    WoodcuttingDamage: string
    WoodcuttingTime: string
    IncreaseGrowSpeed: string

    //  Wood
    DeadTree: string
    Oak: string

    //  Forest
    DeadTreeForest: string
    OakForest: string

    //  Mining
    Mining: string
    OreHp: string
    Mine: string
    OreQta: string
    MiningTime: string
    MiningDamage: string
    SearchOreVein: string
    OreVeins: string
    VeinArmour: string
    VeinGemChance: string

    //  Exp
    MiningExp: string
    WoodcuttingExp: string
    WoodworkingExp: string
    SmithingExp: string
    PersuasionExp: string

    Smithing: string
    WoodAxe: string

    Damage: string
    Armour: string
    AttackSpeed: string

    Pickaxe: string
    ArmourPen: string

    // Perks
    Perks: string
    Available: string
    NotAvailable: string
    Completed: string
    Select: string
    Attributes: string
    healthPoints: string
    StaminaPoints: string
    ManaPoints: string
    Health: string
    Stamina: string
    Mana: string
    HealthRegen: string
    StaminaRegen: string
    ManaRegen: string

    FastWoodcuttingPerk: string
    FastWoodcuttingPerkDesc: string
    FastMiningPerk: string
    FastMiningPerkDesc: string
    VeinMasteryPerk: string
    VeinMasteryPerkDesc: string
    ChargedAttackPerk: string
    ChargedAttackPerkDesc: string
    GrowSpeedMasteryPerk: string
    GrowSpeedMasteryPerkDesc: string
    HighPricesPerk: string
    HighPricesPerkDesc: string
    FastSellingPerk: string
    FastSellingPerkDesc: string

    Base: string
    Total: string
    Used: string
    Filter: string
    ActivityAdded: string
    CombatZones: string

    // battle
    Forest: string
    Boar: string
    Wolves: string
    Combat: string
    Characters: string

    // Abilities
    NormalAttack: string
    NormalAttackDesc: string

    ChargedAttack: string
    ChargedAttackDesc: string

    Unharmed: string

    LongSword: string

    BludgeoningArmour: string
    BludgeoningDamage: string

    PiercingArmour: string
    PiercingDamage: string

    SlashingArmour: string
    SlashingDamage: string
    OneHand: string
    TwoHands: string
    Head: string
    Body: string
    Hands: string
    Feet: string
    DamageType: string

    Defence: string
    Attack: string
    Equipments: string
    YouDied: string

    Archery: string
    OneHanded: string
    TwoHanded: string
    Block: string

    Skills: string
    Start: string
    NewGame: string
    Delete: string
    SavedGames: string
    LoadFromIndexedDB: string
    ImportSave: string
    ExportSave: string
    ExportSaveDesc: string
    ImportSaveDesc: string
    CopyToClipboard: string
    DownloadFile: string
    SaveExportError: string
    SaveImportError: string
    NoSavesFound: string
    Processing: string
    Size: string

    Dagger: string
    TwoHSword: string
    Helmet: string
    Gauntlets: string
    Boots: string

    OffensiveInfo: string
    DefensiveInfo: string
    Allies: string
    Enemies: string

    Empty: string
    FilterDots: string

    Battle: string

    DeadBoar: string
    Loot: string
    Collect: string

    Corpse: string
    Butchering: string

    BoarMeat: string
    BoarSkin: string
    ButcheringExp: string

    Results: string
    YouHave: string

    RawFood: string
    RawSkin: string
    Wolf: string
    DeadWolf: string

    BattleStarted: string
    BattleFinished: string

    Killed: string
    Quests: string

    BoarQuest1: string
    BoarQuest1Desc: string

    AcceptedQuests: string
    AvailableQuests: string
    Complete: string
    Accept: string
    Gold: string

    KillRequestDesc: string
    collectReqDesc: string

    Rewards: string
    items: string

    with1: string
    withProps: string
    highPriority: string
    mediumPriority: string
    lowPriority: string
    selectPlaceholder: string

    collectConsume: string
    deleteSaveTitle: string
    deleteSaveDesc: string
    cancel: string
    travelConfirmTitle: string
    travelConfirmDesc: string
    Travelling: string
    Active: string
    InQueue: string
    BoarTusk: string
    DeadTreeHandle: string
    OakHandle: string

    NoResults: string
    Close: string
    Potion: string
    UnknownPotion: string
    HealthPotion: string
    ManaPotion: string
    StaminaPotion: string
    RegenHealthPotion: string
    RegenManaPotion: string
    RegenStaminaPotion: string
    MaxHealthPotion: string
    MaxManaPotion: string
    MaxStaminaPotion: string
    DamageHealthPotion: string
    DamageManaPotion: string
    DamageRegenHealthPotion: string
    DamageRegenManaPotion: string
    DamageRegenStaminaPotion: string
    Solvent: string
    Flask: string
    Ingredient: string
    OppositeEffects: string
    MultipleEffects: string
    IngredientsStability: string
    Alchemy: string
    Stability: string

    CopperMat: string
    TinMat: string
    DeadWoodMat: string
    OakMat: string

    GlassFlask: string
    Water: string
    RedFlower: string
    GreenFlower: string
    BlueFlower: string
    Ruby: string
    Sapphire: string
    Emerald: string

    Restore: string

    RegenHealth: string
    RestoreHealth: string
    RegenMana: string
    RestoreMana: string
    RegenStamina: string
    RestoreStamina: string
    DamageHealth: string
    DamageMana: string
    DamageStamina: string
    DamageRegenHealth: string
    DamageRegenMana: string
    DamageRegenStamina: string

    CraftingIngredient: string
    AlchemyIngredient: string
    UnknownProperty: string

    LowStabilityNotCraftable: string
    LowStabilityNotCraftableDesc: string

    Lv: string
    Drops: string

    IncreaseMaxHealthBy: string
    IncreaseMaxManaBy: string
    IncreaseMaxStaminaBy: string
    IncreaseMaxHealthBy2: string
    IncreaseMaxManaBy2: string
    IncreaseMaxStaminaBy2: string
    IncreaseMaxHealth: string
    IncreaseMaxMana: string
    IncreaseMaxStamina: string
    PerSecFor: string
    PerSec: string

    Stable: string
    Unstable: string
    Unknown: string
    Chaotic: string

    NormalPotionDesc: string
    UnstablePotionDesc: string
    ChaoticPotionDesc: string
    UnknownPotionDesc: string

    startVillageName: string
    startVillageDesc: string
    woodVillageName: string
    woodVillageDesc: string
    capitalCityName: string
    capitalCityDesc: string
    mountainVillageName: string
    mountainVillageDesc: string
    testName: string
    testDesc: string

    treeGrowBoostName: string
    treeGrowBoostDesc: string
    maxTreeName: string
    maxTreeDesc: string
    marketSaleValueBoostName: string
    marketSaleValueBoostDesc: string
    marketTimeBoostName: string
    marketTimeBoostDesc: string
    oreVeinSearchTimeBoostName: string
    oreVeinSearchTimeBoostDesc: string
    oreVeinQuantityBoostName: string
    oreVeinQuantityBoostDesc: string
    maxOreVeinsBoostName: string
    maxOreVeinsBoostDesc: string

    Use: string

    TestSupplyQuest: string
    TestSupplyQuestDesc: string

    Chicken: string
    DeadChicken: string

    RedMeat: string
    WhiteMeat: string

    VitalHerb: string
    ManaBloom: string
    StaminaLeaf: string
    HealingFungus: string
    ManaSpore: string
    BitterRoot: string
    Nightshade: string
    DamageStaminaPotion: string
    FarmBoarTutorialName: string
    FarmBoarTutorialDescription: string
    FarmBoarHuntTitle: string
    FarmBoarHuntDescription: string
    FarmBoarFenceTitle: string
    FarmBoarFenceDescription: string
    FarmBoarRepellentTitle: string
    FarmBoarRepellentDescription: string
    HeartCrystalDust: string
    ManaCrystalDust: string

    UnknownEffects: string

    RemoveWhenCompleted: string
    RemoveOthers: string
    Repetitions: string
    StartActNow: string

    AddLast: string
    AddFirst: string
    AddBeforeCurrent: string
    AddAfterCurrent: string
    AddOptions: string
    WolfLair: string
    KillToUnlock: string
    Weapons: string
    Armours: string
    Others: string
    Tools: string
    Consumables: string
    SearchItem: string
    Cuisses: string
    Legs: string
    UnlockGathering: string
    UnlockGathering1: string
    UnlockGathering2: string

    //  Caravans
    Caravans: string
    NewCaravan: string
    Destination: string
    CaravanTier: string
    CaravanHeavyCart: string
    CaravanStandard: string
    CaravanFastCourier: string
    Cargo: string
    LoadAllStorage: string
    Dispatch: string
    InTransit: string
    Returning: string
    Recall: string
    recallConfirmTitle: string
    recallConfirmDesc: string
    Duration: string
    TotalCost: string
    TotalVolume: string
    From: string
    To: string
    NoActiveShipments: string
    ArrivesIn: string
    AvailableSlots: string
    NotEnoughCargo: string
    NotEnoughGold: string
    NoFreeSlots: string
    SelectDestination: string
    SelectTier: string
    NoDestinations: string
    AddToCaravan: string
    AlreadyInCargo: string
    TimeRemaining: string
    Arrived: string
    AddAll: string

    //  Market
    Market: string
    MarketUnknownItem: string
    MarketTime: string
    SaleValue: string
    PersuasionBonus: string
    SelectItem: string
    Sell: string
    SellAll: string
    QuickSell: string

    // Vendors
    Vendors: string
    GeneralMerchant: string
    Blacksmith: string
    Alchemist: string
    UnlimitedStock: string
    UnitPrice: string
    Buy: string

    Error: string
    IndexedDbNotFound: string
    ToggleTheme: string
    ThemeLight: string
    ThemeDark: string
    ThemeSystem: string
    ThemeZinc: string
    ThemeBlue: string
    ThemeGreen: string
    ThemeViolet: string
    SkillRotation: string
    Equip: string
    MainHand: string
    TwoHand: string
    Common: string
    Uncommon: string
    Rare: string
    SaveStringEmpty: string
    SaveFileTooLarge: string
}
