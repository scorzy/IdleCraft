import { Msg } from '../msg/Msg'

export enum ExpEnum {
    Woodcutting = 'Woodcutting',
    Woodworking = 'Woodworking',
    Mining = 'Mining',
    Smithing = 'Smithing',
}
export const ExpData: { [k in ExpEnum]: { nameId: keyof Msg } } = {
    [ExpEnum.Mining]: { nameId: 'MiningExp' },
    [ExpEnum.Woodcutting]: { nameId: 'WoodcuttingExp' },
    [ExpEnum.Woodworking]: { nameId: 'WoodworkingExp' },
    [ExpEnum.Smithing]: { nameId: 'SmithingExp' },
}
