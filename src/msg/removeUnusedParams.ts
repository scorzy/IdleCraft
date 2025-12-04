import { memoize } from 'micro-memoize'

export const removeUnusedParams = memoize(
    (name: string) => {
        return name
            .replace(/(\{[a-zA-Z0-9_]+\})/g, '')
            .replace(/\s{2,}/g, ' ')
            .trim()
    },
    { maxSize: 1000 }
)
