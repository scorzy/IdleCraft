export interface ItemId {
    stdItemId: string | null
    craftItemId: string | null
}
export interface StorageState {
    StdItems: {
        [k: string]: number
    }
    CraftedItems: {
        [k: string]: number
    }
}
