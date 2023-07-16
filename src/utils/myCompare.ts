/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

function compareObjWith(objA: any, objB: any): boolean {
    const objToCompare: [any, any][] = [[objA, objB]]

    let pop = objToCompare.pop()
    while (pop) {
        const [objA1, objB1] = pop

        const keyValues = Object.entries(objA1)

        for (const kv of keyValues) {
            const [key, value] = kv

            if (key === 'id') continue
            if (value === undefined && objB1[key] === undefined) continue
            if (value === null && objB1[key] === null) continue
            if (value === null && objB1[key] !== null) return false
            if (value === undefined && objB1[key] !== undefined) return false

            const valueType = typeof value

            if (valueType === 'boolean' || valueType === 'number' || valueType === 'string') {
                if (value !== objB1[key]) return false
            } else if (valueType === 'object') objToCompare.push([value, objB1[key]])
        }

        pop = objToCompare.pop()
    }
    return true
}

export function myCompare(objA: any, objB: any): boolean {
    if (objA === objB) return true
    if (objA === undefined) return false
    if (objB === undefined) return false
    return compareObjWith(objA, objB)
}
