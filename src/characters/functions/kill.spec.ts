import { beforeEach, describe, expect, it } from 'vitest'
import { ActivityAdapter } from '../../activities/ActivityState'
import { BattleZoneEnum } from '../../battle/BattleZoneEnum'
import { makeBattle } from '../../battle/functions/addBattle'
import { initialize } from '../../game/functions/initialize'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { PLAYER_ID } from '../charactersConst'
import { kill } from './kill'

describe('kill', () => {
    let state: GameState

    beforeEach(() => {
        initialize()
        state = GetInitialGameState()
    })
    it('kill player', () => {
        makeBattle(BattleZoneEnum.Wolf)(state)
        kill(state, PLAYER_ID)

        expect(state.ui.deadDialog).toBe(true)
        expect(state.activities).toEqual(ActivityAdapter.getInitialState())
        expect(state.characters.ids.length).toBe(1)
    })
    it('kill player 2', () => {
        makeBattle(BattleZoneEnum.Wolf)(state)
        makeBattle(BattleZoneEnum.Boar)(state)
        kill(state, PLAYER_ID)

        expect(state.ui.deadDialog).toBe(true)
        expect(state.activities).toEqual(ActivityAdapter.getInitialState())
        expect(state.characters.ids.length).toBe(1)
    })
})
