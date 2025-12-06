import { AbstractEntityAdapter } from '../../entityAdapter/entityAdapter'
import { Icons } from '../../icons/Icons'
import { Msg } from '../../msg/Msg'
import { Effects } from './Effects'

export interface AppliedEffect {
    id: string
    effect: Effects
    duration: number
    nameId: keyof Msg
    iconId: Icons
    target?: string
    value?: number
}
class AppliedEffectAdapterInt extends AbstractEntityAdapter<AppliedEffect> {
    getId(data: AppliedEffect): string {
        return data.id
    }
}
export const AppliedEffectAdapter = new AppliedEffectAdapterInt()
