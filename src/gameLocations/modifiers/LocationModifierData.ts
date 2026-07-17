import { Icons } from '../../icons/Icons'
import { Msg } from '../../msg/Msg'
import { LocationModifierType } from './LocationModifier'

export interface LocationModifierData {
    nameId: keyof Msg
    descriptionId: keyof Msg
    iconId: Icons
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
}
