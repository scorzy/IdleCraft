export type Translations = { t: Msg; fun: MsgFunctions }

export interface Msg {
    Activities: string
    Storage: string
    Woodcutting: string
    Time: string
    Stop: string
    MoveUp: string
    MoveDown: string
    Remove: string

    //  Trees
    Cutting: string
    TreeHP: string
    Cut: string
    Trees: string
    GrowingTrees: string

    //  Wood
    DeadTree: string
    Oak: string

    //  Logs
    DeadTreeLog: string
    OakLog: string

    //  Forest
    DeadTreeForest: string
    OakForest: string
}
export interface MsgFunctions {
    // Time
    years: (qta: number, formattedQta: string) => string
    months: (qta: number, formattedQta: string) => string
    days: (qta: number, formattedQta: string) => string
    h: (qta: number, formattedQta: string) => string
    m: (qta: number, formattedQta: string) => string
    s: (qta: number, formattedQta: string) => string

    //
    cutting: (woodName: keyof Msg) => string
}
export type makeMsgFun = (msg: Msg) => MsgFunctions
