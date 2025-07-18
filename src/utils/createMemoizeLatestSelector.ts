import { shallowEqual } from 'fast-equals'
import { createSelectorCreator, lruMemoize } from 'reselect'
import { RESELECT_MAX_SIZE } from '../const'

export const createMemoizeLatestSelector = createSelectorCreator({
    memoize: lruMemoize,
    memoizeOptions: {
        equalityCheck: shallowEqual,
        resultEqualityCheck: shallowEqual,
        maxSize: RESELECT_MAX_SIZE,
    },
})
