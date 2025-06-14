import { engMsg, makeEngMsg } from './eng'
import { Translations } from './Msg'

export const messages: Record<string, Translations> = {
    eng: { t: engMsg, fun: makeEngMsg(engMsg) },
}
