import { myCompare } from './myCompare'
import { describe, test, expect } from 'vitest'

describe('myCompare', () => {
    test('myCompare', () => {
        const a = { id: 0, a: 'aaa' }
        const b = { id: 1, b: 'bbb' }

        expect(myCompare(a, b)).toBeFalsy()
        expect(myCompare(b, a)).toBeFalsy()
    })
    test('myCompare 2', () => {
        const a = { id: 0, a: 'aaa' }
        const b = { id: '2', b: 'bbb', c: 'ccc' }

        expect(myCompare(a, b)).toBeFalsy()
        expect(myCompare(b, a)).toBeFalsy()
    })
    test('myCompare 3', () => {
        const a = {}
        const b = {}

        expect(myCompare(a, b)).toBeTruthy()
        expect(myCompare(b, a)).toBeTruthy()
    })
    test('myCompare 5', () => {
        const a = { id: 1, a: 'aaa' }
        const b = { id: 1, a: 'aaa' }

        expect(myCompare(a, b)).toBeTruthy()
        expect(myCompare(b, a)).toBeTruthy()
    })
    test('myCompare 6', () => {
        const a = { id: 2, a: 'aaa', arr: [] }
        const b = { id: 1, a: 'aaa' }

        expect(myCompare(a, b)).toBeTruthy()
        expect(myCompare(b, a)).toBeTruthy()
    })
    test('myCompare 7', () => {
        const a = { id: 5, a: 'aaa', obj: {} }
        const b = { id: 1, a: 'aaa' }

        expect(myCompare(a, b)).toBeTruthy()
        expect(myCompare(b, a)).toBeTruthy()
    })
    test('myCompare 8', () => {
        const a = { id: 1, a: 'aaa' }
        const b = a

        expect(myCompare(a, b)).toBeTruthy()
        expect(myCompare(b, a)).toBeTruthy()
    })
    test('myCompare 9', () => {
        const a = { id: 1, a: 'aaa' }
        const b = undefined

        expect(myCompare(a, b)).toBeFalsy()
        expect(myCompare(b, a)).toBeFalsy()
    })
    test('myCompare 10', () => {
        const a = { id: 1, a: 'aaa', b: { a: '123' } }
        const b = { id: 2, a: 'aaa', b: { a: '123' } }

        expect(myCompare(a, b)).toBeTruthy()
        expect(myCompare(b, a)).toBeTruthy()
    })
    test('myCompare 11', () => {
        const a = { id: 1, a: 'aaa', b: { a: null } }
        const b = { id: 2, a: 'aaa', b: { a: null } }

        expect(myCompare(a, b)).toBeTruthy()
        expect(myCompare(b, a)).toBeTruthy()
    })
    test('myCompare 12', () => {
        const a = { id: 1, a: 'aaa', b: { c: 1 } }
        const b = { id: 2, a: 'aaa', b: { a: null } }

        expect(myCompare(a, b)).toBeFalsy()
        expect(myCompare(b, a)).toBeFalsy()
    })
})
