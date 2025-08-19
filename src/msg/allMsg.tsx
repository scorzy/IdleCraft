import { engMsg, makeEngMsg } from './eng'
import { Translations } from './Msg'

export const messages: Record<string, (f: (value: number) => string) => Translations> = {
    eng: (f) => ({ t: engMsg, fun: makeEngMsg(engMsg, f) }),
}
