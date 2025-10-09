import { Item } from '../../items/Item'

export function getNameParams(items: Item[]): Record<string, string> | undefined {
    const nameParams: Record<string, string> = {}
    items
        .slice()
        .reverse()
        .forEach((item) => {
            if (item.params)
                Object.entries(item.params).forEach(([key, value]) => {
                    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                        nameParams[key] = String(value)
                    }
                })
        })

    if (Object.keys(nameParams).length === 0) return

    return nameParams
}
