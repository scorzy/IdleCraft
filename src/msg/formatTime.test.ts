import { describe, test, expect } from 'vitest'
import { engMsg, makeEngMsg } from './eng'

const formatTime = makeEngMsg(engMsg, (value: number) => value.toString()).formatTime

describe('time formatting', () => {
    test('format year', () => {
        const year = formatTime(1e3 * 3600 * 24 * 365 * 5.456)
        expect(year).toBe('5 years')
    })
    test('format month', () => {
        const month = formatTime(1e3 * 3600 * 24 * 30 * 5.456)
        expect(month).toBe('5 months')
    })
    test('format 12 seconds', () => {
        const seconds = formatTime(1e3 * 12.5)
        expect(seconds).toBe('12s')
    })
    test('format 4.2 seconds', () => {
        const seconds = formatTime(1e3 * 4.2159)
        expect(seconds).toBe('4.2s')
    })
    test('format 2 days', () => {
        const seconds = formatTime(1e3 * 3600 * 24 * 2)
        expect(seconds).toBe('2 days')
    })
    test('format 3 hours', () => {
        const seconds = formatTime(1e3 * 3600 * 3)
        expect(seconds).toBe('3h')
    })
    test('format 4 minutes', () => {
        const seconds = formatTime(1e3 * 60 * 4)
        expect(seconds).toBe('4m')
    })
})
