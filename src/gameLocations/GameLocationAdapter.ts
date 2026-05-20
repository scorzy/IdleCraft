import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'
import type { InitialState } from '../entityAdapter/InitialState'
import type { LocationState } from '../game/GameState'
import { GameLocations } from './GameLocations'

type AnyRecord = Record<string, unknown>

function isRecord(value: unknown): value is AnyRecord {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isInitialState(value: unknown): value is { ids: unknown[]; entries: AnyRecord } {
    return isRecord(value) && Array.isArray(value.ids) && isRecord(value.entries)
}

function isGameLocation(value: string): value is GameLocations {
    return Object.values(GameLocations).includes(value as GameLocations)
}

class GameLocationAdapterInt extends AbstractEntityAdapter<LocationState> {
    getId(data: LocationState): string {
        return data.id
    }

    getIds(state: InitialState<LocationState>): GameLocations[] {
        return super.getIds(state) as GameLocations[]
    }

    select(state: InitialState<LocationState>, id: GameLocations): LocationState | undefined {
        return super.select(state, id)
    }

    selectEx(state: InitialState<LocationState>, id: GameLocations): LocationState {
        return super.selectEx(state, id)
    }

    load(data: unknown): InitialState<LocationState> {
        const state = this.getInitialState()

        if (isInitialState(data)) {
            for (const id of data.ids) {
                if (typeof id !== 'string' || !isGameLocation(id)) continue
                const location = this.completeLocation(data.entries[id], id)
                if (location) this.create(state, location)
            }
            return state
        }

        if (isRecord(data)) {
            for (const [id, locationData] of Object.entries(data)) {
                if (!isGameLocation(id)) continue
                const location = this.completeLocation(locationData, id)
                if (location) this.create(state, location)
            }
        }

        return state
    }

    private completeLocation(data: unknown, id: GameLocations): LocationState | null {
        if (!isRecord(data)) return null
        return { ...data, id } as LocationState
    }
}

export const GameLocationAdapter = new GameLocationAdapterInt()
