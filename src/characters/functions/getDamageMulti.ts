const ARMOUR_SCALING_P = 0.5

export function getDamageMulti(damage: number, armour: number): number {
    if (damage <= 0) return 0
    if (armour === 0) return 1

    const armourRatio = Math.abs(armour) / damage
    const reduction = 1 / (1 + Math.pow(armourRatio, ARMOUR_SCALING_P))

    return armour > 0 ? reduction : 2 - reduction
}
