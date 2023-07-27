import { Msg } from './Msg'

export const engMsg: Msg = {
    Activities: 'Activities',
    Storage: 'Storage',
    Woodcutting: 'Woodcutting',
    DeadTree: 'Dead Tree',
    Oak: 'Oak',
    years: (qta: number, formattedQta: string) => `${formattedQta} ${qta === 1 ? 'year' : 'years'}`,
    months: (qta: number, formattedQta: string) => `${formattedQta} ${qta === 1 ? 'month' : 'months'}`,
    days: (qta: number, formattedQta: string) => `${formattedQta} ${qta === 1 ? 'day' : 'days'}`,
    h: (_qta: number, formattedQta: string) => `${formattedQta}h`,
    m: (_qta: number, formattedQta: string) => `${formattedQta}m`,
    s: (_qta: number, formattedQta: string) => `${formattedQta}s`,
}
