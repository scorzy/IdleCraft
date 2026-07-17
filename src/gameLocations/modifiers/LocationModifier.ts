import { AbstractEntityAdapter } from '../../entityAdapter/entityAdapter'

export enum LocationModifierType {
    TreeGrowBoost = 'TreeGrowBoost',
    MaxTree = 'MaxTree',
}

export interface LocationModifier {
    id: string
    type: LocationModifierType
    multi: number
}

class LocationModifierAdapterInt extends AbstractEntityAdapter<LocationModifier> {
    getId(data: LocationModifier): string {
        return data.id
    }
}

export const LocationModifierAdapter = new LocationModifierAdapterInt()
