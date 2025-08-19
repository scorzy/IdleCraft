import { myMemoize } from '../utils/myMemoize'

const SEC_IN_HOUR = 3600
const SEC_IN_DAY = 3600 * 24
const SEC_IN_MONTH = 3600 * 24 * 30
const SEC_IN_YEAR = 3600 * 24 * 365

export interface TimeParts {
    years: number
    months: number
    days: number
    hours: number
    minutes: number
    seconds: number
}

export const splitTime = myMemoize(function splitTime(time: number): TimeParts {
    time /= 1000 // Convert milliseconds to seconds
    const years = Math.floor(time / SEC_IN_YEAR)
    time -= years * SEC_IN_YEAR
    const months = Math.floor(time / SEC_IN_MONTH)
    time -= months * SEC_IN_MONTH
    const days = Math.floor(time / SEC_IN_DAY)
    time -= days * SEC_IN_DAY
    const hours = Math.floor(time / SEC_IN_HOUR)
    time -= hours * SEC_IN_HOUR
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor((time % 60) * 10) / 10
    return { years, months, days, hours, minutes, seconds }
})
