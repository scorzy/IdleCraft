export function getRandomNum(lower: number, upper: number) {
    return lower + Math.floor(Math.random() * (upper - lower + 1))
}
