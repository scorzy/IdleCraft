import moize from 'moize'

const options = {
    isDeepEqual: true,
    maxSize: 100,
}

export const myMemoize = moize(options)
