import { Msg } from '../../msg/Msg'

export enum Materials {
    Copper = 'Copper',
    Tin = 'Tin',
    DeadWood = 'DeadWood',
    Oak = 'Oak',
}
export interface Material {
    id: Materials
    nameId: keyof Msg
    color: string
}
export const MaterialsData: Record<Materials, Material> = {
    [Materials.Copper]: { id: Materials.Copper, color: '#b87333', nameId: 'CopperMat' },
    [Materials.Tin]: { id: Materials.Tin, color: '#d2d2d2', nameId: 'TinMat' },
    [Materials.DeadWood]: { id: Materials.Tin, color: '#d2d2d2', nameId: 'DeadWoodMat' },
    [Materials.Oak]: { id: Materials.Tin, color: '#d2d2d2', nameId: 'OakMat' },
}
