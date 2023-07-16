import { Msg } from '../msg/Msg'
const SEC_IN_HOUR = 3600
const SEC_IN_DAY = 3600 * 24
const SEC_IN_MONTH = 3600 * 24 * 30
const SEC_IN_YEAR = 3600 * 24 * 365

export function getTimeFormatter(numberFormat: (num: number) => string, t: Msg) {
    return (time: number) => formatTime(time, numberFormat, t)
}

export function formatTime(time: number, numberFormat: (num: number) => string, t: Msg): string {
    time /= 1000

    const years = Math.floor(time / SEC_IN_YEAR)
    if (years > 0) return t.years(years, numberFormat(years))

    const months = Math.floor((time / SEC_IN_MONTH) % 12)
    if (months > 0) return t.months(months, numberFormat(months))

    const days = Math.floor((time / SEC_IN_DAY) % 30)
    if (days > 0) return t.days(days, numberFormat(days))

    const hours = Math.floor((time / SEC_IN_HOUR) % 24)
    if (hours > 0) return t.h(hours, numberFormat(hours))

    const minutes = Math.floor((time / 60) % 60)
    if (minutes > 0) return t.m(minutes, numberFormat(minutes))

    const seconds = time % 60
    if (seconds >= 10) return t.s(Math.floor(seconds), Math.floor(seconds).toString())
    return t.s(Math.floor(seconds * 10) / 10, numberFormat(Math.floor(seconds * 10) / 10))
}
