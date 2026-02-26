import { ActivityAdapter } from '../../activities/ActivityState'
import { ActivityStartResult } from '../../activities/activityInterfaces'
import { makeExecActivity } from '../../activities/functions/makeExecActivity'
import { ExpEnum } from '../../experience/ExpEnum'
import { addExp } from '../../experience/expFunctions'
import { addItem } from '../../storage/storageFunctions'
import { Timer } from '../../timers/Timer'
import { isGathering } from '../Gathering'
import { gatherResources } from '../gatheringFunctions'
import { GatheringData } from '../gatheringData'

export const execGathering = makeExecActivity((state, timer: Timer) => {
    const id = timer.actId
    if (!id) throw new Error('[execGathering] Missing activity id in timer')

    const activity = ActivityAdapter.select(state.activities, id)
    if (!activity) return ActivityStartResult.NotPossible
    if (!isGathering(activity)) throw new Error('[execGathering] Activity is not gathering')

    const zoneData = GatheringData[activity.zone]
    const drops = gatherResources(zoneData)

    for (const drop of drops) addItem(state, drop.id, 1)

    addExp(state, ExpEnum.Gathering, zoneData.expPerCycle)

    return ActivityStartResult.Ended
})
