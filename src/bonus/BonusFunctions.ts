import { Bonus } from './Bonus'

export function GetTotal(bonuses: Bonus[]): number {
    let ret = 0
    for (const bonus of bonuses) ret += bonus.add ?? 0
    for (const bonus of bonuses) {
        if (!bonus.multi) continue
        ret *= 1 + bonus.multi / 100
    }
    return ret
}
