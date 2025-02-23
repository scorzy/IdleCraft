import moize from 'moize'

const options = {
    maxSize: 1,
}

export const myMemoizeOne = moize(options)
