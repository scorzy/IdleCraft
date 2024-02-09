export interface InitialState<T> {
    ids: string[]
    entries: Record<string, T>
}
