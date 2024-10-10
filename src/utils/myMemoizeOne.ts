import moize from 'moize'

const options = {
    isDeepEqual: true,
    maxSize: 1,
    maxAge: 1000 * 60 * 5, // five minutes;
}

export const myMemoizeOne = moize(options)
