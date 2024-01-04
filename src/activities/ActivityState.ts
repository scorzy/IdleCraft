import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'

export enum ActivityTypes {
    Woodcutting = 'Woodcutting',
    Crafting = 'Crafting',
    Mining = 'Mining',
    Battle = 'Battle',
    Tree = 'Tree',
    Ability = 'Ability',
}
export interface ActivityState {
    id: string
    type: ActivityTypes
    max: number
}
class ActivityAdapterInt extends AbstractEntityAdapter<ActivityState> {
    getId(data: ActivityState): string {
        return data.id
    }
}
export const ActivityAdapter = new ActivityAdapterInt()
