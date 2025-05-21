import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'

export enum BattleLogType {
    Kill = 'kill',
    Damage = 'Damage',
    Start = 'Start',
    End = 'End',
}

export interface AddBattleLog {
    type: BattleLogType
}
export interface AddKillBattleLog {
    type: BattleLogType.Kill
    targets: string
}
export type AddDamageBattleLog = AddBattleLog & {
    iconId: Icons
    source: string
    targets: string
    damageDone: number
    abilityId: keyof Msg
}

export type BattleLog = {
    id: string
    date: number
    type: BattleLogType
}
export type KillBattleLog = BattleLog & { targets: string }
export type StartBattleLog = BattleLog
export type EndBattleLog = BattleLog
export type DamageBattleLog = BattleLog & {
    iconId: Icons
    source: string
    targets: string
    damageDone: number
    abilityId: keyof Msg
}

export function isKillBattleLog(log: BattleLog): log is KillBattleLog {
    return log.type === BattleLogType.Kill
}
export function isStartBattleLog(log: BattleLog): log is StartBattleLog {
    return log.type === BattleLogType.Start
}
export function isEndBattleLog(log: BattleLog): log is EndBattleLog {
    return log.type === BattleLogType.End
}
export function isDamageBattleLog(log: BattleLog | DamageBattleLog): log is DamageBattleLog {
    return log.type === BattleLogType.Damage
}
