import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { GameState } from './GameState'
import { InitialGameState } from './InitialGameState'
import { regenerate } from './regenerate'
import { selectGameId } from './gameSelectors'

export const useGameStore = create<GameState>()(devtools(() => InitialGameState))

setInterval(() => {
    const gameId = useGameStore(selectGameId)
    if (gameId === '') return
    useGameStore.setState((s) => regenerate(s, Date.now()))
}, 1e3)

if (!('indexedDB' in window)) {
    console.log("This browser doesn't support IndexedDB")
} else {
    const open = window.indexedDB.open('IdleCraft', 1)

    open.onupgradeneeded = () => {
        const db = open.result
        db.createObjectStore('save', { keyPath: 'gameId' })
    }
    open.onsuccess = () => {
        useGameStore.subscribe((state: GameState) => {
            if (state.gameId === '') return
            const db = open.result

            const transaction = db.transaction('save', 'readwrite')
            const objectStore = transaction.objectStore('save')

            const putRes = objectStore.put(state)
            putRes.onerror = () => {
                console.log(`Save failed`)
            }
        })
    }
}
