import moize from 'moize'

const options = { maxSize: 30 }

export const myMemoize = moize(options)
