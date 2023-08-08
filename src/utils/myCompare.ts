import equal from 'react-fast-compare'

export function myCompare(objA: object | undefined, objB: object | undefined): boolean {
    if (objA === objB) return true
    if (objA === undefined) return false
    if (objB === undefined) return false

    if ('id' in objA) {
        const objANoId = { ...objA }
        delete objANoId.id
        objA = objANoId
    }

    if ('id' in objB) {
        const objBNoId = { ...objB }
        delete objBNoId.id
        objB = objBNoId
    }

    return equal(objA, objB)
}
