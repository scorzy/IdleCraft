import { GameState } from '../../game/GameState'
import { DamageTypes } from '../../items/Item'
import { selectMainWeapon } from './selectMainWeapon'

export const selectDamageType = (charId: string) => (state: GameState) => {
    const weapon = selectMainWeapon(charId)(state)
    return weapon?.weaponData?.damageType ?? DamageTypes.Bludgeoning
}
