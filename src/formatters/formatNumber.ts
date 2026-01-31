import { myMemoize } from '../utils/myMemoize'
import { CommaTypes } from './CommaTypes'
import { NotationTypes } from './NotationTypes'

// prettier-ignore
const suffixes = [
    "", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No",
    "Dc", "UDc", "DDc", "TDc", "QaDc", "QiDc", "SxDc", "SpDc", "ODc", "NDc",
    "Vi", "UVi", "DVi", "TVi", "QaVi", "QiVi", "SxVi", "SpVi", "OVi", "NVi",
    "Tg", "UTg", "DTg", "TTg", "QaTg", "QiTg", "SxTg", "SpTg", "OTg", "NTg",
    "Qd", "UQd", "DQd", "TQd", "QaQd", "QiQd", "SxQd", "SpQd", "OQd", "NQd",
    "Qq", "UQq", "DQq", "TQq", "QaQq", "QiQq", "SxQq", "SpQq", "OQq", "NQq",
    "Sg", "USg", "DSg", "TSg", "QaSg", "QiSg", "SxSg", "SpSg", "OSg", "NSg",
    "St", "USt", "DSt", "TSt", "QaSt", "QiSt", "SxSt", "SpSt", "OSt", "NSt",
    "Og", "UOg", "DOg", "TOg", "QaOg", "QiOg", "SxOg", "SpOg", "OOg", "NOg"
]
const suffixesUpper = suffixes.map((s) => s.toUpperCase())

const DIGITS = 4

export function getFormatter(
    notation: NotationTypes,
    comma: CommaTypes
): [(value: number) => string, (formatted: string) => number] {
    let commaParam: CommaTypes.IT | CommaTypes.US | undefined
    if (comma === CommaTypes.IT || comma === CommaTypes.US) commaParam = comma

    const engineeringFormatter = new Intl.NumberFormat(commaParam, {
        maximumSignificantDigits: DIGITS,
        notation: 'engineering',
    })
    const scientificFormatter = new Intl.NumberFormat(commaParam, {
        maximumSignificantDigits: DIGITS,
        notation: 'scientific',
    })
    const compactFormatter = new Intl.NumberFormat(commaParam, {
        maximumSignificantDigits: DIGITS,
        notation: 'compact',
    })

    const n = suffixes.length
    const parts = new Intl.NumberFormat(commaParam).formatToParts(123456.789)
    const groupSep = parts.find((p) => p.type === 'group')?.value ?? ''
    const decimalSep = parts.find((p) => p.type === 'decimal')?.value ?? '.'

    const parseIntl = myMemoize((str: string) => {
        str = str.replace(groupSep, '').toUpperCase()
        let i = n - 1
        for (; i >= 0; i--) {
            const suffix = suffixesUpper[i]
            if (suffix && str.endsWith(suffix)) break
        }
        let multi = 1
        if (i < n && i > -1) {
            multi = 10 ** (i * 3)
            const suffix = suffixesUpper[i]
            if (suffix) str = str.replace(suffix, '')
        } else {
            const splitE = str.split('E')
            if (splitE.length > 1) {
                const exp = Number(splitE[1])
                if (isFinite(exp)) multi = 10 ** exp
                str = splitE[0] ?? str
            }
        }
        const numStr = decimalSep === 'A' ? str : str.replace(decimalSep, '.')
        const num = Number(numStr)
        if (!isFinite(num)) return 0
        return num * multi
    })

    let formatter: (value: number) => string

    switch (notation) {
        case NotationTypes.STANDARD:
            formatter = (value: number) => {
                if (value >= Number.POSITIVE_INFINITY) return '∞'
                if (isNaN(value)) return 'NaN'
                if (value < 1e4) return compactFormatter.format(value)

                value = floorSigfigs(value, 4)
                const val = engineeringFormatter.format(value)
                const index = Math.max(0, Math.floor(Math.log10(Math.abs(value)) / 3))

                if (index > suffixes.length) return scientificFormatter.format(value)

                const suffix = (suffixes[index] !== '' ? suffixes[index] : '') ?? ''
                const split = val.split('E')
                const prefix: string = split[0] ?? ''
                return `${prefix}${suffix}`
            }
            break
        case NotationTypes.SCIENTIFIC:
            formatter = (value: number) => {
                if (value >= Number.POSITIVE_INFINITY) return '∞'
                if (isNaN(value)) return 'NaN'
                if (value < 1e3) return compactFormatter.format(value)
                value = floorSigfigs(value, DIGITS)
                return scientificFormatter.format(value)
            }
            break
        case NotationTypes.ENGINEERING:
            formatter = (value: number) => {
                if (value >= Number.POSITIVE_INFINITY) return '∞'
                if (isNaN(value)) return 'NaN'
                if (value < 1e4) return compactFormatter.format(value)
                value = floorSigfigs(value, DIGITS)
                return engineeringFormatter.format(value)
            }
            break
    }

    formatter = myMemoize(formatter)

    return [formatter, parseIntl]
}

// From Swarm Number format
// Math.floor() to a specified number of sigfigs for native JS numbers.
// Like Decimal.floor(sigfigs).
// Based on http://blog.magnetiq.com/post/497605344/rounding-to-a-certain-significant-figures-in
function floorSigfigs(n: number, sig: number): number {
    if (!sig) return n
    if (n < 0) return -floorSigfigs(-n, sig)
    const multi = 10 ** (sig - Math.floor(Math.log(n) / Math.LN10) - 1)
    return Math.floor(n * multi) / multi
}
