import { describe, it, expect } from 'vitest'
import { splitTime, TimeParts } from './splitTime'

describe('splitTime', () => {
    it('splits zero milliseconds', () => {
        expect(splitTime(0)).toEqual<TimeParts>({
            years: 0,
            months: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        })
    })

    it('splits less than a minute', () => {
        expect(splitTime(45000)).toEqual<TimeParts>({
            years: 0,
            months: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 45,
        })
    })

    it('splits one minute', () => {
        expect(splitTime(60000)).toEqual<TimeParts>({
            years: 0,
            months: 0,
            days: 0,
            hours: 0,
            minutes: 1,
            seconds: 0,
        })
    })

    it('splits one hour', () => {
        expect(splitTime(3600000)).toEqual<TimeParts>({
            years: 0,
            months: 0,
            days: 0,
            hours: 1,
            minutes: 0,
            seconds: 0,
        })
    })

    it('splits one day', () => {
        expect(splitTime(86400000)).toEqual<TimeParts>({
            years: 0,
            months: 0,
            days: 1,
            hours: 0,
            minutes: 0,
            seconds: 0,
        })
    })

    it('splits one month', () => {
        expect(splitTime(2592000000)).toEqual<TimeParts>({
            years: 0,
            months: 1,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        })
    })

    it('splits one year', () => {
        expect(splitTime(31536000000)).toEqual<TimeParts>({
            years: 1,
            months: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        })
    })

    it('splits a complex time', () => {
        // 1 year, 2 months, 3 days, 4 hours, 5 minutes, 6.7 seconds
        const ms =
            31536000000 + // 1 year
            2 * 2592000000 + // 2 months
            3 * 86400000 + // 3 days
            4 * 3600000 + // 4 hours
            5 * 60000 + // 5 minutes
            6700 // 6.7 seconds
        expect(splitTime(ms)).toEqual<TimeParts>({
            years: 1,
            months: 2,
            days: 3,
            hours: 4,
            minutes: 5,
            seconds: 6.7,
        })
    })
})
