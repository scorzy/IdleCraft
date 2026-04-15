import { deepEqual } from 'fast-equals'

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function mergeArrays<T>(a: T[], b: T[]): T[] {
    const result: T[] = [...a]

    for (const item of b) if (!result.some((existing) => deepEqual(existing, item))) result.push(item)

    return result
}

export function deepMerge<T>(target: T, source: Partial<T>): T {
    if (!isObject(target) || !isObject(source)) return source as T

    const result: Record<string, unknown> = { ...target }

    for (const key of Object.keys(source)) {
        const sourceValue = (source as Record<string, unknown>)[key]
        const targetValue = result[key]

        if (Array.isArray(sourceValue) && Array.isArray(targetValue))
            result[key] = mergeArrays(targetValue, sourceValue)
        else if (isObject(sourceValue) && isObject(targetValue)) result[key] = deepMerge(targetValue, sourceValue)
        else result[key] = sourceValue
    }

    return result as T
}
