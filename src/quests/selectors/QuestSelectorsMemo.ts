import { memoize } from 'proxy-memoize'
import { selectAcceptedQuests, selectAvailableQuests } from './QuestSelectors'

export const selectAcceptedQuestsMemo = memoize(selectAcceptedQuests)
export const selectAvailableQuestsMemo = memoize(selectAvailableQuests)
