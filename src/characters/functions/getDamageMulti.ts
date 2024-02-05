export function getDamageMulti(damage: number, armour: number): number {
    if (damage <= 0) return 0
    let multi = damage / (damage + armour)
    if (armour < 0 && multi > 2) multi = (2.5 * damage - armour ** 2) / (2.5 * armour)
    return Math.max(0, multi)
}
