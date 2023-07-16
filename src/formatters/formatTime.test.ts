import { formatTime } from './formatTime'
import { describe, test, expect } from 'vitest'
import { engMsg as t } from '../msg/eng'

const f = (num: number) => `${num}`

describe('time formatting', () => {
    test('format year', () => {
        const year = formatTime(1e3 * 3600 * 24 * 365 * 5.456, f, t)
        expect(year).toBe('5 years')
    })
    test('format month', () => {
        const month = formatTime(1e3 * 3600 * 24 * 30 * 5.456, f, t)
        expect(month).toBe('5 months')
    })
    test('format 12 seconds', () => {
        const seconds = formatTime(1e3 * 12.5, f, t)
        expect(seconds).toBe('12s')
    })
    test('format 4.2 seconds', () => {
        const seconds = formatTime(1e3 * 4.2159, f, t)
        expect(seconds).toBe('4.2s')
    })
    test('format 2 days', () => {
        const seconds = formatTime(1e3 * 3600 * 24 * 2, f, t)
        expect(seconds).toBe('2 days')
    })
    test('format 3 hours', () => {
        const seconds = formatTime(1e3 * 3600 * 3, f, t)
        expect(seconds).toBe('3h')
    })
    test('format 4 minutes', () => {
        const seconds = formatTime(1e3 * 60 * 4, f, t)
        expect(seconds).toBe('4m')
    })
})
