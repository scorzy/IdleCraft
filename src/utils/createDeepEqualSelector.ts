import { deepEqual } from 'fast-equals'
import { createSelectorCreator, weakMapMemoize } from 'reselect'

export const createDeepEqualSelector = createSelectorCreator({
    memoize: weakMapMemoize,
    memoizeOptions: { resultEqualityCheck: deepEqual },
})
