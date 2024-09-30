import { Bonus, BonusResult } from '../../bonus/Bonus'
import { bonusFromItem, getTotal } from '../../bonus/BonusFunctions'
import { GameState } from '../../game/GameState'
import { DamageTypes } from '../../items/Item'
import { memoize } from '../../utils/memoize'
import { InventoryItems, selectAllCharInventory } from './selectAllCharInventory'

const selectArmourList = memoize((inventory: InventoryItems, type: DamageTypes) => {
    const bonuses: Bonus[] = []

    Object.entries(inventory).forEach((kv) => {
        const item = kv[1]
        if (!item.armourData) return
        const add = item.armourData[type]
        if (add && add !== 0)
            bonuses.push(
                bonusFromItem(item, {
                    add,
                })
            )
    })

    const bonusList: BonusResult = {
        bonuses,
        total: getTotal(bonuses),
    }
    return bonusList
})

export const selectCharacterArmourList = memoize((charId: string, type: DamageTypes) => (state: GameState) => {
    const inventory = selectAllCharInventory(state, charId)

    return selectArmourList(inventory, type)
})
export const selectCharacterArmour = memoize(
    (charId: string, type: DamageTypes) => (state: GameState) => selectCharacterArmourList(charId, type)(state).total
)
