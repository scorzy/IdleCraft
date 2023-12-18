import { useGameStore } from '../../game/state'
import { BattleActivityCreator } from '../BattleActivityCreator'
import { BattleAddType } from '../BattleTypes'

// eslint-disable-next-line import/no-unused-modules
export const addBattle = (data: BattleAddType) =>
    useGameStore.setState((state) => new BattleActivityCreator(state, data).createActivity())
