import { InitialState } from '../../entityAdapter/entityAdapter'
import { GameState } from '../../game/GameState'
import { memoizeOne } from '../../utils/memoizeOne'
import { CharacterAdapter } from '../characterAdapter'
import { CharacterState } from '../characterState'

const selectTeamsInt = memoizeOne((state: InitialState<CharacterState>) => {
    const allies: string[] = []
    const enemies: string[] = []
    CharacterAdapter.forEach(state, (c) => {
        if (c.isEnemy) enemies.push(c.id)
        else allies.push(c.id)
    })
    return { allies, enemies }
})

export const selectTeams = (state: GameState) => {
    return selectTeamsInt(state.characters)
}
