import { engMsg, makeEngMsg } from './eng'
import { Translations } from './Translations'

export const messages: Record<string, (f: (value: number) => string) => Translations> = {
    eng: (f) => ({ t: engMsg, fun: makeEngMsg(engMsg, f) }),
}
