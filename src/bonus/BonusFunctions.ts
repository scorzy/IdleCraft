import { Item } from '../items/Item'
import { PerksData } from '../perks/Perk'
import { PerksEnum } from '../perks/perksEnum'
import { Bonus } from './Bonus'

export function getTotal(bonuses: Bonus[]): number {
    let ret = 0
    for (const bonus of bonuses) ret += bonus.add ?? 0
    for (const bonus of bonuses) {
        if (!bonus.multi) continue
        ret *= 1 + bonus.multi / 100
    }
    return ret
}

export function bonusFromItem(item: Item, bonus: Partial<Bonus>): Bonus {
    return {
        id: item.id,
        nameId: item.nameId,
        iconId: item.icon,
        ...bonus,
    }
}
export function bonusFromPerk(perkEnum: PerksEnum, bonus: Partial<Bonus>): Bonus {
    const perk = PerksData[perkEnum]
    return {
        id: perk.id,
        nameId: perk.nameId,
        iconId: perk.iconId,
        ...bonus,
    }
}
