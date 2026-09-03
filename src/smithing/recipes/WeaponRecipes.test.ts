import { describe, expect, it } from 'vitest'
import { Recipe } from '../../crafting/Recipe'
import { GetInitialGameState } from '../../game/InitialGameState'
import { DamageTypes, ItemType, WeaponData, WeaponItem } from '../../items/Item'
import { twoHSwordRecipe } from './2HSword'
import { daggerRecipe } from './Dagger'
import { longSwordRecipe } from './LongSwordRecipe'

type CraftedWeapon = WeaponItem & { weaponData: WeaponData }

const craftWeapon = (recipe: Recipe): CraftedWeapon => {
    const item = recipe
        .getResult(GetInitialGameState(), [{ id: 'bar', itemId: 'CopperBar' }])
        ?.results.at(0)?.craftedItem
    const weaponData = item?.weaponData
    if (!item || item.type !== ItemType.Weapon || !weaponData) throw new Error('Expected a crafted weapon')
    return { ...item, weaponData }
}

describe('weapon smithing recipes', () => {
    it('gives dagger, longsword, and two-handed sword distinct combat roles', () => {
        const dagger = craftWeapon(daggerRecipe)
        const longsword = craftWeapon(longSwordRecipe)
        const twoHandedSword = craftWeapon(twoHSwordRecipe)

        expect(dagger.weaponData.damage).toMatchObject({ [DamageTypes.Piercing]: expect.any(Number) })
        expect(dagger.weaponData.damage[DamageTypes.Slashing]).toBeUndefined()
        expect(longsword.weaponData.damage).toMatchObject({ [DamageTypes.Slashing]: expect.any(Number) })
        expect(twoHandedSword.weaponData.damage).toMatchObject({ [DamageTypes.Slashing]: expect.any(Number) })

        expect(dagger.weaponData.attackSpeed).toBeLessThan(longsword.weaponData.attackSpeed)
        expect(longsword.weaponData.attackSpeed).toBeLessThan(twoHandedSword.weaponData.attackSpeed)
        expect(twoHandedSword.weaponData.damage[DamageTypes.Slashing]).toBeGreaterThan(
            longsword.weaponData.damage[DamageTypes.Slashing]!
        )
    })
})
