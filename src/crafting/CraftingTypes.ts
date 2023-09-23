import { ExpEnum } from '../experience/expEnum'

export enum CraftingTypes {
    Woodworking = 'Woodworking',
    Smithing = 'Smithing',
}
export const CraftingData: { [k in CraftingTypes]: { expType: ExpEnum } } = {
    [CraftingTypes.Woodworking]: {
        expType: ExpEnum.Woodworking,
    },
    [CraftingTypes.Smithing]: {
        expType: ExpEnum.Smithing,
    },
}
