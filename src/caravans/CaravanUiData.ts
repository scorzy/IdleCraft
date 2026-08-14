import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'
import { CaravanTierId } from './CaravanConst'

export interface CaravanTierUiData {
    nameId: keyof Msg
    icon: Icons
}

export const CaravanTierData: Record<CaravanTierId, CaravanTierUiData> = {
    [CaravanTierId.HeavyCart]: { nameId: 'CaravanHeavyCart', icon: Icons.HeavyCart },
    [CaravanTierId.Standard]: { nameId: 'CaravanStandard', icon: Icons.Caravan },
    [CaravanTierId.FastCourier]: { nameId: 'CaravanFastCourier', icon: Icons.FastCourier },
}
