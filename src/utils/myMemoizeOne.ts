import moize from 'moize'

const options = {
    isDeepEqual: true,
    maxSize: 1,
}

export const myMemoizeOne = moize(options)
