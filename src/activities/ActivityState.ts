import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'

export enum ActivityTypes {
    Woodcutting = 'Woodcutting',
    Crafting = 'Crafting',
    Mining = 'Mining',
    Battle = 'Battle',
    Tree = 'Tree',
    Ability = 'Ability',
    StartBattle = 'StartBattle',
    Effect = 'Effect',
}
export interface ActivityState {
    id: string
    type: ActivityTypes
    max: number
}
class ActivityAdapterInt<T extends ActivityState> extends AbstractEntityAdapter<T> {
    getId(data: ActivityState): string {
        return data.id
    }
}
export const ActivityAdapter = new ActivityAdapterInt()
