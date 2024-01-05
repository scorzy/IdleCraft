let lastCounter = 0
const start = new Date(2024, 1).getTime()
export function getUniqueId(): string {
    return `${(lastCounter++).toString(36)}${(Date.now() - start).toString(36)}`
}
