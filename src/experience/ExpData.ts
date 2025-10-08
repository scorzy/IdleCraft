import { Msg } from '../msg/Msg'
import { ExpEnum } from './ExpEnum'

export const ExpData: Record<ExpEnum, { nameId: keyof Msg }> = {
    [ExpEnum.Mining]: { nameId: 'MiningExp' },
    [ExpEnum.Woodcutting]: { nameId: 'WoodcuttingExp' },
    [ExpEnum.Woodworking]: { nameId: 'WoodworkingExp' },
    [ExpEnum.Smithing]: { nameId: 'SmithingExp' },
    [ExpEnum.Archery]: { nameId: 'Archery' },
    [ExpEnum.OneHanded]: { nameId: 'OneHanded' },
    [ExpEnum.TwoHanded]: { nameId: 'TwoHanded' },
    [ExpEnum.Block]: { nameId: 'Block' },
    [ExpEnum.Butchering]: { nameId: 'ButcheringExp' },
    [ExpEnum.Alchemy]: { nameId: 'Alchemy' },
}
