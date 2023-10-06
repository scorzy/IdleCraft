let lastCounter = 0
const start = new Date(2023).getTime()
export function getUniqueId(): string {
    lastCounter++
    const ret = `${(Date.now() - start).toString(36)}-${lastCounter.toString(36)}`
    return ret
}
