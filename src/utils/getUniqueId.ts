let lastCounter = 0
export function getUniqueId(): string {
    lastCounter++
    const ret = Date.now().toString(36) + lastCounter.toString(36)
    if (lastCounter >= Number.MAX_SAFE_INTEGER - 1) lastCounter = Number.MIN_SAFE_INTEGER + 1
    return ret
}
