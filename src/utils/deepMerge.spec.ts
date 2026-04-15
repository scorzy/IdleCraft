import { describe, it, expect } from 'vitest'
import { deepMerge } from './deepMerge'

describe('deepMerge', () => {
    it('should merge flat objects', () => {
        const a = { a: 1 }
        const b = { b: 2 }

        const result = deepMerge(a, b)

        expect(result).toEqual({ a: 1, b: 2 })
    })

    it('should override primitive values from source', () => {
        const a = { a: 1 }
        const b = { a: 2 }

        const result = deepMerge(a, b)

        expect(result).toEqual({ a: 2 })
    })

    it('should deeply merge nested objects', () => {
        const a = { nested: { a: 1 } }
        const b = { nested: { b: 2 } }

        const result = deepMerge(a, b)

        expect(result).toEqual({ nested: { a: 1, b: 2 } })
    })

    it('should merge arrays without duplicating primitives', () => {
        const a = { items: [1, 2] }
        const b = { items: [2, 3] }

        const result = deepMerge(a, b)

        expect(result).toEqual({ items: [1, 2, 3] })
    })

    it('should merge arrays without duplicating objects', () => {
        const a = { items: [{ id: 1 }, { id: 2 }] }
        const b = { items: [{ id: 2 }, { id: 3 }] }

        const result = deepMerge(a, b)

        expect(result).toEqual({
            items: [{ id: 1 }, { id: 2 }, { id: 3 }],
        })
    })

    it('should not duplicate deeply equal objects in arrays', () => {
        const a = { items: [{ a: { x: 1 } }] }
        const b = { items: [{ a: { x: 1 } }] }

        const result = deepMerge(a, b)

        expect(result.items).toHaveLength(1)
    })

    it('should handle nested objects containing arrays', () => {
        const a = {
            data: {
                items: [{ id: 1 }],
                value: 10,
            },
        }

        const b = {
            data: {
                items: [{ id: 1 }, { id: 2 }],
                other: 20,
            },
        }

        const result = deepMerge(a, b)

        expect(result).toEqual({
            data: {
                items: [{ id: 1 }, { id: 2 }],
                value: 10,
                other: 20,
            },
        })
    })

    it('should fully override when source is not an object', () => {
        const a = { a: 1 }
        const b = 5 as unknown as Partial<typeof a>

        const result = deepMerge(a, b)

        expect(result).toBe(5)
    })

    it('should not mutate the original target object', () => {
        const a = { items: [1, 2] }
        const b = { items: [3] }

        const result = deepMerge(a, b)

        expect(a).toEqual({ items: [1, 2] })
        expect(result).toEqual({ items: [1, 2, 3] })
    })

    it('should correctly handle empty arrays', () => {
        const a = { items: [] as number[] }
        const b = { items: [1] }

        const result = deepMerge(a, b)

        expect(result).toEqual({ items: [1] })
    })

    it('should preserve order: target items first, then new unique items', () => {
        const a = { items: [2, 1] }
        const b = { items: [1, 3] }

        const result = deepMerge(a, b)

        expect(result.items).toEqual([2, 1, 3])
    })
})
