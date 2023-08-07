import { StdItems } from '../items/stdItems'

export interface ItemId {
    stdItemId: keyof typeof StdItems | null
    craftItemId: string | null
}
export interface StorageState {
    StdItems: {
        [k in keyof typeof StdItems]?: number
    }
    CraftedItems: {
        [k: string]: number
    }
}
