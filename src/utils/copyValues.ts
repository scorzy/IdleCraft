export function copyValues(origin: object, objValues: object) {
    const keys = Object.entries(objValues)
    keys.forEach((e) => {
        const key = e[0]
        if (key in origin) {
            const value: unknown = e[1]
            if (
                typeof value === 'bigint' ||
                typeof value === 'boolean' ||
                typeof value === 'number' ||
                typeof value === 'string'
            )
                (origin as { [key in string]: unknown })[key] = value
        }
    })
}
