import { Icons } from '../../icons/Icons'
import { Msg } from '../../msg/Msg'
import { LocationModifierType } from './LocationModifier'

export interface LocationModifierData {
    nameId: keyof Msg
    descriptionId: keyof Msg
    iconId: Icons
    percentage?: boolean
}

export const LocationModifierDataMap: Record<LocationModifierType, LocationModifierData> = {
    [LocationModifierType.TreeGrowBoost]: {
        nameId: 'treeGrowBoostName',
        descriptionId: 'treeGrowBoostDesc',
        iconId: Icons.Tree,
    },
    [LocationModifierType.MaxTree]: {
        nameId: 'maxTreeName',
        descriptionId: 'maxTreeDesc',
        iconId: Icons.Tree,
    },
    [LocationModifierType.MarketSaleValue]: {
        nameId: 'marketSaleValueBoostName',
        descriptionId: 'marketSaleValueBoostDesc',
        iconId: Icons.Market,
    },
    [LocationModifierType.MarketTime]: {
        nameId: 'marketTimeBoostName',
        descriptionId: 'marketTimeBoostDesc',
        iconId: Icons.Market,
    },
    [LocationModifierType.OreVeinSearchTime]: {
        nameId: 'oreVeinSearchTimeBoostName',
        descriptionId: 'oreVeinSearchTimeBoostDesc',
        iconId: Icons.Ore,
    },
    [LocationModifierType.OreVeinQuantity]: {
        nameId: 'oreVeinQuantityBoostName',
        descriptionId: 'oreVeinQuantityBoostDesc',
        iconId: Icons.Ore,
    },
    [LocationModifierType.MaxOreVeins]: {
        nameId: 'maxOreVeinsBoostName',
        descriptionId: 'maxOreVeinsBoostDesc',
        iconId: Icons.Ore,
        percentage: false,
    },
}
