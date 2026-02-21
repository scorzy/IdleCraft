import { ActivityTypes } from '../../activities/ActivityState'
import { makeAddActivity } from '../../activities/functions/makeAddActivity'
import { GameLocations } from '../../gameLocations/GameLocations'
import { WoodTypes } from '../WoodTypes'

export const makeIncreaseGrowSpeed = (woodType: WoodTypes, location: GameLocations) =>
    makeAddActivity(ActivityTypes.IncreaseGrowSpeed, { woodType, location })
