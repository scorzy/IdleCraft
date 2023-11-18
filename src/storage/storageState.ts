export interface ItemId {
    stdItemId: string | null
    craftItemId: string | null
}
export interface StorageState {
    StdItems: Record<string, number>
    CraftedItems: Record<string, number>
}
