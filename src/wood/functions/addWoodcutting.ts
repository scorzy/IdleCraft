import { ActivityTypes } from '../../activities/ActivityState'
import { makeAddActivity } from '../../activities/functions/makeAddActivity'
import { setState } from '../../game/setState'
import { WoodTypes } from '../WoodTypes'

const makeWoodcutting = (woodType: WoodTypes) => makeAddActivity(ActivityTypes.Woodcutting, { woodType })

export const addWoodcutting = (woodType: WoodTypes) => setState((s) => makeWoodcutting(woodType)(s))
