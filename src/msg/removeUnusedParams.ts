import moize from 'moize'

export const removeUnusedParams = moize(
    (name: string) => {
        return name
            .replace(/(\{[a-zA-Z0-9_]+\})/g, '')
            .replace(/\s{2,}/g, ' ')
            .trim()
    },
    { maxSize: 1000 }
)
