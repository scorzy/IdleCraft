import { ActivityAdapter } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { selectTranslations } from '../../msg/useTranslations'
import { isGathering } from '../Gathering'
import { GatheringSubZoneData } from '../gatheringData'

export function getGatheringTitle(state: GameState, id: string) {
    const data = ActivityAdapter.selectEx(state.activities, id)
    if (!isGathering(data)) throw new Error('[getGatheringTitle] Activity is not gathering')

    const { t } = selectTranslations(state)
    const subZone = GatheringSubZoneData[data.zone]
    return `${t.Gathering} ${t[subZone.zone]} - ${subZone.name}`
}
