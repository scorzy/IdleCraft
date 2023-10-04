let lastCounter = 0
const start = new Date(2023).getTime()
export function getUniqueId(): string {
    lastCounter++
    // if (lastCounter >= Number.MAX_SAFE_INTEGER - 1) lastCounter = Number.MIN_SAFE_INTEGER + 1

    const ret = `${(Date.now() - start).toString(36)}${lastCounter.toString(36)}`
    return ret
}
