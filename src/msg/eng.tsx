import { Msg, MsgFunctions } from './Msg'

export const engMsg: Msg = {
    Activities: 'Activities',
    Storage: 'Storage',
    Woodcutting: 'Woodcutting',
    Time: 'Time',
    Stop: 'Stop',
    DeadTree: 'Dead Tree',
    Oak: 'Oak',
    DeadTreeLog: 'Dead Tree Log',
    OakLog: 'Oak Log',
    DeadTreeForest: 'Dead Tree Forest',
    OakForest: 'Oak Forest',
    Cutting: 'Cutting',
    TreeHP: 'Tree HP',
    Cut: 'Cut',
    Trees: 'Trees',
    GrowingTrees: 'Growing Trees',
}
export const engMsgFun: MsgFunctions = {
    years: (qta: number, formattedQta: string) => `${formattedQta} ${qta === 1 ? 'year' : 'years'}`,
    months: (qta: number, formattedQta: string) => `${formattedQta} ${qta === 1 ? 'month' : 'months'}`,
    days: (qta: number, formattedQta: string) => `${formattedQta} ${qta === 1 ? 'day' : 'days'}`,
    h: (_qta: number, formattedQta: string) => `${formattedQta}h`,
    m: (_qta: number, formattedQta: string) => `${formattedQta}m`,
    s: (_qta: number, formattedQta: string) => `${formattedQta}s`,
}
