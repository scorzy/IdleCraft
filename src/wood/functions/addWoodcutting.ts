import { ActivityTypes } from '../../activities/ActivityState'
import { makeAddActivity } from '../../activities/functions/makeAddActivity'
import { useGameStore } from '../../game/state'
import { WoodTypes } from '../WoodTypes'

const makeWoodcutting = (woodType: WoodTypes) => makeAddActivity(ActivityTypes.Woodcutting, { woodType })

export const addWoodcutting = (woodType: WoodTypes) => useGameStore.setState((s) => makeWoodcutting(woodType)(s))
