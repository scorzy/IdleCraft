import { getRandomNum } from './getRandomNum'

export function arraySample<T>(array: T[]) {
    const length = array.length
    return length ? array[getRandomNum(0, length - 1)] : undefined
}
