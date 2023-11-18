export interface ItemId {
    stdItemId: string | null
    craftItemId: string | null
}
export interface StorageState {
    StdItems: {
        [k in string]?: number
    }
    CraftedItems: {
        [k in string]?: number
    }
}
