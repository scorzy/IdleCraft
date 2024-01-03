export class MapEx<K, V> extends Map<K, V> {
    getEx(key: K): V {
        const res = this.get(key)
        if (!res) throw new Error(`${JSON.stringify(key)} not found`)
        return res
    }
}
