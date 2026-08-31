import { describe, expect, it } from 'vitest'
import { ActivityTypes } from '../activities/ActivityState'
import { PLAYER_ID } from '../characters/charactersConst'
import { AppliedEffect } from '../effects/types/AppliedEffect'
import { Effects } from '../effects/types/Effects'
import { Icons } from '../icons/Icons'
import { Timer } from '../timers/Timer'
import { groupWeaponCoatingEffects } from './weaponCoatingSelectors'

const effect = (id: string, type: Effects, value: number): AppliedEffect => ({
    id,
    effect: type,
    duration: 1_000,
    nameId: 'DamageRegenHealthPotion',
    iconId: Icons.Poison,
    target: PLAYER_ID,
    sourceId: 'coating',
    value,
})

const timer = (id: string, from: number, to: number): Timer => ({
    id,
    from,
    to,
    type: ActivityTypes.Effect,
    actId: id,
})

describe('groupWeaponCoatingEffects', () => {
    it('groups matching effects within the start and end timing tolerance', () => {
        const groups = groupWeaponCoatingEffects([
            { effect: effect('first', Effects.DamageRegenHealth, -2), timer: timer('first', 1_000, 6_000) },
            { effect: effect('second', Effects.DamageRegenHealth, -3), timer: timer('second', 1_099, 6_099) },
        ])

        expect(groups).toHaveLength(1)
        expect(groups[0]).toMatchObject({ count: 2, totalValue: 5, timer: { id: 'first' } })
    })

    it('keeps effects separate at the 100 ms start or end boundary and for different types', () => {
        const groups = groupWeaponCoatingEffects([
            { effect: effect('first', Effects.DamageRegenHealth, -2), timer: timer('first', 1_000, 6_000) },
            { effect: effect('start', Effects.DamageRegenHealth, -2), timer: timer('start', 1_100, 6_000) },
            { effect: effect('end', Effects.DamageRegenHealth, -2), timer: timer('end', 1_000, 6_100) },
            { effect: effect('mana', Effects.DamageRegenMana, -2), timer: timer('mana', 1_000, 6_000) },
        ])

        expect(groups).toHaveLength(4)
        expect(groups.map((group) => group.totalValue)).toEqual([2, 2, 2, 2])
    })
})
