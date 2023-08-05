import { engMsg, engMsgFun } from './eng'
import { Msg, MsgFunctions } from './Msg'

export const messages: { [K: string]: { t: Msg; fun: MsgFunctions } } = {
    eng: { t: engMsg, fun: engMsgFun },
}
