import moize from 'moize'

const options = {
    isDeepEqual: true,
    maxSize: 100,
    maxAge: 1000 * 60 * 5, // five minutes;
}

export const myMemoize = moize(options)
