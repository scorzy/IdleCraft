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
    [Materials.Copper]: { id: Materials.Copper, color: 'text-copper-foreground', nameId: 'CopperMat' },
    [Materials.Tin]: { id: Materials.Tin, color: 'text-tin-foreground', nameId: 'TinMat' },
    [Materials.DeadWood]: { id: Materials.Tin, color: 'text-dead-tree-foreground', nameId: 'DeadWoodMat' },
    [Materials.Oak]: { id: Materials.Tin, color: 'text-oak-foreground', nameId: 'OakMat' },
}
