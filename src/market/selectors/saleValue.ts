import { Bonus, BonusResult } from '../../bonus/Bonus'
import { bonusFromItem, bonusFromPerk, getTotal } from '../../bonus/BonusFunctions'
import { PLAYER_ID } from '../../characters/charactersConst'
import { ExpEnum } from '../../experience/ExpEnum'
import { selectLevel } from '../../experience/expSelectors'
import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { hasPerk } from '../../perks/PerksSelectors'
import { PerksEnum } from '../../perks/perksEnum'
import { selectGameItem } from '../../storage/StorageSelectors'
import { HIGH_PRICES_PERK, PERSUASION_VALUE_PER_LEVEL } from '../MarketConst'

const EMPTY_SELL = { total: 0, bonuses: [] }
export const selectSaleValueAll =
    (itemId: string) =>
    (s: GameState): BonusResult => {
        const item = selectGameItem(itemId)(s)
        if (!item) return EMPTY_SELL

        const level = selectLevel(ExpEnum.Persuasion, PLAYER_ID)(s)
        const highPricesPerk = hasPerk(PerksEnum.HIGH_PRICES)(s)

        const ret: BonusResult = { total: item.value, bonuses: [bonusFromItem(item, { add: item.value })] }

        if (level > 0) {
            const persuasionBonus: Bonus = {
                id: 'persuasion',
                nameId: 'PersuasionBonus',
                iconId: Icons.Persuasion,
                multi: level * PERSUASION_VALUE_PER_LEVEL,
            }
            ret.bonuses.push(persuasionBonus)
        }

        if (highPricesPerk) ret.bonuses.push(bonusFromPerk(PerksEnum.HIGH_PRICES, { multi: HIGH_PRICES_PERK }))

        ret.total = getTotal(ret.bonuses)
        return ret
    }

export const selectSaleValue = (itemId: string) => (state: GameState) => selectSaleValueAll(itemId)(state).total
