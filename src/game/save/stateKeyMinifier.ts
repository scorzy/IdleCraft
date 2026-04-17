type AnyRecord = Record<string, unknown>

const gameStateKeyMap = {
    gameId: 'gi',
    isTimer: 'it',
    gold: 'go',
    lastRegen: 'lr',
    ui: 'ui',
    notifications: 'no',
    timers: 'ti',
    loading: 'lo',
    now: 'nw',
    location: 'lc',
    activities: 'ac',
    orderedActivities: 'oa',
    activityId: 'ai',
    activityDone: 'ad',
    lastActivityDone: 'la',
    craftedItems: 'ci',
    waitingTrees: 'wt',
    locations: 'ls',
    treeGrowth: 'tg',
    growSpeedBonuses: 'gb',
    recipeId: 'ri',
    craftingForm: 'cf',
    characters: 'ch',
    castCharAbility: 'ca',
    battleLogs: 'bl',
    quests: 'qu',
    discoveredEffects: 'de',
    effects: 'ef',
    addActType: 'aa',
    removeOtherActivities: 'ro',
    startActNow: 'sn',
    actRepetitions: 'ar',
    actAutoRemove: 'am',
} as const

const locationStateKeyMap = {
    storage: 'st',
    forests: 'fo',
    ores: 'or',
    oreVeins: 'ov',
    loot: 'lt',
    unlockedGatheringZones: 'ug',
} as const

const reverseGameStateKeyMap = Object.fromEntries(
    Object.entries(gameStateKeyMap).map(([key, value]) => [value, key])
) as Record<string, string>

const reverseLocationStateKeyMap = Object.fromEntries(
    Object.entries(locationStateKeyMap).map(([key, value]) => [value, key])
) as Record<string, string>

function isRecord(value: unknown): value is AnyRecord {
    return typeof value === 'object' && value !== null
}

function remapKeys(input: AnyRecord, keyMap: Record<string, string>): AnyRecord {
    const output: AnyRecord = {}
    for (const [key, value] of Object.entries(input)) {
        output[keyMap[key] ?? key] = value
    }
    return output
}

function remapLocationRecord(input: unknown, keyMap: Record<string, string>): unknown {
    if (!isRecord(input)) return input

    const output: AnyRecord = {}
    for (const [locationId, locationState] of Object.entries(input)) {
        if (!isRecord(locationState)) {
            output[locationId] = locationState
            continue
        }

        output[locationId] = remapKeys(locationState, keyMap)
    }

    return output
}

export function minifyStateKeys(input: unknown): unknown {
    if (!isRecord(input)) return input

    const minified = remapKeys(input, gameStateKeyMap)
    const compactLocationsKey = gameStateKeyMap.locations
    if (compactLocationsKey in minified) {
        minified[compactLocationsKey] = remapLocationRecord(minified[compactLocationsKey], locationStateKeyMap)
    }

    return minified
}

export function restoreStateKeys(input: unknown): unknown {
    if (!isRecord(input)) return input

    const restored = remapKeys(input, reverseGameStateKeyMap)
    if ('locations' in restored) {
        restored.locations = remapLocationRecord(restored.locations, reverseLocationStateKeyMap)
    }

    return restored
}
