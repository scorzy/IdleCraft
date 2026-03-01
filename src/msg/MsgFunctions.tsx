import { ReactNode } from 'react'
import { QuestParams } from '../quests/QuestParams'
import { Msg } from './Msg'
import { GetItemNameParams } from './GetItemNameParams'

export interface MsgFunctions {
    // Time
    years: (qta: number, formattedQta: string) => string
    months: (qta: number, formattedQta: string) => string
    days: (qta: number, formattedQta: string) => string
    h: (qta: number, formattedQta: string) => string
    m: (qta: number, formattedQta: string) => string
    s: (qta: number, formattedQta: string) => string

    formatTime: (time: number) => string
    formatTimePrecise: (time: number) => string

    getItemName: (params: GetItemNameParams) => string

    //
    cutting: (woodName: keyof Msg) => string
    boostTree: (woodName: keyof Msg) => string
    crafting: (itemName: string) => string
    mining: (woodName: keyof Msg) => string

    OreVein: (oreName: string) => string

    //
    prestigePercent: (bonus: string) => string
    speedBonusPercent: (bonus: string) => string

    fighting: (enemy: keyof Msg) => string

    requireWoodcuttingLevel: (formattedQta: string) => string
    requireMiningLevel: (formattedQta: string) => string

    testQuestName: (questParams: QuestParams) => string
    testQuestDesc: (questParams: QuestParams) => string
    testOutcomeDesc: (questParams: QuestParams) => string
    testOutcome2Desc: (questParams: QuestParams) => string

    collectN: (n: number) => string

    collectItemsTotal: (n: number) => ReactNode
}
