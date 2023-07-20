import { WoodTypes } from './WoodTypes'
export interface WoodDataType {
    maxHp: number
    maxQta: number
}
export const WoodData: { [k in WoodTypes]: WoodDataType } = {
    [WoodTypes.Fir]: {
        maxHp: 100,
        maxQta: 10,
    },
}
