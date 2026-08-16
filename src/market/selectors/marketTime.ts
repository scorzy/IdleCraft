import { Bonus, BonusResult } from '../../bonus/Bonus'
import { bonusFromPerk, getTotal } from '../../bonus/BonusFunctions'
import { GameState } from '../../game/GameState'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { LocationModifierType } from '../../gameLocations/modifiers/LocationModifier'
import { LocationModifierDataMap } from '../../gameLocations/modifiers/LocationModifierData'
import { selectLocationModifierMulti } from '../../gameLocations/modifiers/locationModifierSelectors'
import { Icons } from '../../icons/Icons'
import { hasPerk } from '../../perks/PerksSelectors'
import { PerksEnum } from '../../perks/perksEnum'
import { FAST_SELLING_PERK, MARKET_BASE_TIME } from '../MarketConst'

const TIME_BASE: Bonus = {
    id: 'base',
    nameId: 'Base',
    iconId: Icons.Market,
    add: MARKET_BASE_TIME,
}
const PERK_FAST_SELLING: Bonus = bonusFromPerk(PerksEnum.FAST_SELLING, { multi: -1 * FAST_SELLING_PERK })

export const selectMarketTimeAll = (s: GameState) => {
    const fastSellingPerk = hasPerk(PerksEnum.FAST_SELLING)(s)
    const locationModifier = selectLocationModifierMulti(s, s.location, LocationModifierType.MarketTime)
    const ret: BonusResult = { total: MARKET_BASE_TIME, bonuses: [TIME_BASE] }

    if (fastSellingPerk) ret.bonuses.push(PERK_FAST_SELLING)
    if (locationModifier) {
        const data = LocationModifierDataMap[LocationModifierType.MarketTime]
        const location = GameLocationAdapter.selectEx(s.locations, s.location)
        ret.bonuses.push({
            id: `${location.id}-MarketTime`,
            nameId: data.nameId,
            iconId: data.iconId,
            multi: locationModifier,
        })
    }

    ret.total = getTotal(ret.bonuses)
    return ret
}

export const selectMarketTime = (state: GameState) => selectMarketTimeAll(state).total
