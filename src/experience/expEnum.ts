import { Msg } from '../msg/Msg'

export enum ExpEnum {
    Woodcutting = 'Woodcutting',
    Woodworking = 'Woodworking',
    Mining = 'Mining',
    Smithing = 'Smithing',
    Archery = 'Archery',
    OneHanded = 'OneHanded',
    TwoHanded = 'TwoHanded ',
    Block = 'Block',
    Butchering = 'Butchering',
}
export const ExpData: { [k in ExpEnum]: { nameId: keyof Msg } } = {
    [ExpEnum.Mining]: { nameId: 'MiningExp' },
    [ExpEnum.Woodcutting]: { nameId: 'WoodcuttingExp' },
    [ExpEnum.Woodworking]: { nameId: 'WoodworkingExp' },
    [ExpEnum.Smithing]: { nameId: 'SmithingExp' },
    [ExpEnum.Archery]: { nameId: 'Archery' },
    [ExpEnum.OneHanded]: { nameId: 'OneHanded' },
    [ExpEnum.TwoHanded]: { nameId: 'TwoHanded' },
    [ExpEnum.Block]: { nameId: 'Block' },
    [ExpEnum.Butchering]: { nameId: 'ButcheringExp' },
}
