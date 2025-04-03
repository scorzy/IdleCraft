export interface Translations {
    t: Msg
    fun: MsgFunctions
}

export interface Msg {
    LevelToLow: string
    Activities: string
    Abilities: string
    Storage: string
    Woodcutting: string
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
    Handle: string
    DeadTreeHandle: string
    OakHandle: string
    Ore: string
    Bar: string
    CopperOre: string
    TinOre: string

    //  Trees
    Cutting: string
    TreeHP: string
    Cut: string
    Trees: string
    GrowingTrees: string
    WoodcuttingDamage: string
    WoodcuttingTime: string

    //  Wood
    DeadTree: string
    Oak: string

    //  Logs
    DeadTreeLog: string
    OakLog: string

    //  Planks
    DeadTreePlank: string
    OakPlank: string

    //  Forest
    DeadTreeForest: string
    OakForest: string

    //  Mining
    Mining: string
    OreHp: string
    Mine: string
    OreQta: string
    OreVein: string
    MiningTime: string
    MiningDamage: string

    //  Exp
    MiningExp: string
    WoodcuttingExp: string
    WoodworkingExp: string
    SmithingExp: string

    // Bars
    TinBar: string
    CopperBar: string

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

    FastWoodcuttingPerk: string
    FastWoodcuttingPerkDesc: string
    FastMiningPerk: string
    FastMiningPerkDesc: string
    ChargedAttackPerk: string
    ChargedAttackPerkDesc: string

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
    Body: string
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

    Dagger: string
    TwoHSword: string

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
}
export interface MsgFunctions {
    // Time
    years: (qta: number, formattedQta: string) => string
    months: (qta: number, formattedQta: string) => string
    days: (qta: number, formattedQta: string) => string
    h: (qta: number, formattedQta: string) => string
    m: (qta: number, formattedQta: string) => string
    s: (qta: number, formattedQta: string) => string

    //
    cutting: (woodName: keyof Msg) => string
    crafting: (itemNameId: keyof Msg) => string
    mining: (woodName: keyof Msg) => string

    //
    prestigePercent: (bonus: string) => string
    speedBonusPercent: (bonus: string) => string

    fighting: (enemy: keyof Msg) => string

    requireWoodcuttingLevel: (formattedQta: string) => string
    requireMiningLevel: (formattedQta: string) => string
}
