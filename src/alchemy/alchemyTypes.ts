export enum AlchemyPotency {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
}
export enum PotionResult {
    Stable = 'Stable',
    Unstable = 'Unstable',
    Chaotic = 'Chaotic',
    Unknown = 'Unknown',
    NotPotion = 'NotPotion',
}
export enum AlchemyEffects {
    Health = 'Health',
    Mana = 'Mana',
    Stamina = 'Stamina',
    RegenHealth = 'RegenHealth',
    RegenMana = 'RegenMana',
    RegenStamina = 'RegenStamina',
    DamageHealth = 'DamageHealth',
    DamageMana = 'DamageMana',
    DamageStamina = 'DamageStamina',
    DamageRegenHealth = 'DamageRegenHealth',
    DamageRegenMana = 'vRegenMana',
    DamageRegenStamina = 'DamageRegenStamina',
}
export enum IngredientTypes {
    Herb = 'Herb',
    Mineral = 'Mineral',
    Animal = 'Animal',
}
export interface IngredientEffect {
    potency: AlchemyPotency
    effect: AlchemyEffects
}

export interface IngredientData {
    type: IngredientTypes
    effects: IngredientEffect[]
    stability?: number
}
export interface SolventData {
    potency: AlchemyPotency
}
export interface PotionFlaskData {
    reusePercent: number
}

export interface PotionEffect {
    effect: AlchemyEffects
    value: number
    duration: number
}

export interface PotionData {
    effects: PotionEffect[]
}
