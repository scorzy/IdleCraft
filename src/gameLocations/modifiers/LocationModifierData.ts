import { Icons } from '../../icons/Icons'
import { Msg } from '../../msg/Msg'
import { LocationModifierType } from './LocationModifier'

export interface LocationModifierData {
    nameId: keyof Msg
    descriptionId: keyof Msg
    iconId: Icons
    percentage?: boolean
    sumType: 'add' | 'multi'
}

export const LocationModifierDataMap: Record<LocationModifierType, LocationModifierData> = {
    [LocationModifierType.TreeGrowBoost]: {
        nameId: 'treeGrowBoostName',
        descriptionId: 'treeGrowBoostDesc',
        iconId: Icons.Tree,
        sumType: 'multi',
    },
    [LocationModifierType.MaxTree]: {
        nameId: 'maxTreeName',
        descriptionId: 'maxTreeDesc',
        iconId: Icons.Tree,
        sumType: 'multi',
    },
    [LocationModifierType.MarketSaleValue]: {
        nameId: 'marketSaleValueBoostName',
        descriptionId: 'marketSaleValueBoostDesc',
        iconId: Icons.Market,
        sumType: 'multi',
    },
    [LocationModifierType.MarketTime]: {
        nameId: 'marketTimeBoostName',
        descriptionId: 'marketTimeBoostDesc',
        iconId: Icons.Market,
        sumType: 'multi',
    },
    [LocationModifierType.OreVeinSearchTime]: {
        nameId: 'oreVeinSearchTimeBoostName',
        descriptionId: 'oreVeinSearchTimeBoostDesc',
        iconId: Icons.Ore,
        sumType: 'multi',
    },
    [LocationModifierType.OreVeinQuantity]: {
        nameId: 'oreVeinQuantityBoostName',
        descriptionId: 'oreVeinQuantityBoostDesc',
        iconId: Icons.Ore,
        sumType: 'multi',
    },
    [LocationModifierType.MaxOreVeins]: {
        nameId: 'maxOreVeinsBoostName',
        descriptionId: 'maxOreVeinsBoostDesc',
        iconId: Icons.Ore,
        percentage: false,
        sumType: 'add',
    },
}
