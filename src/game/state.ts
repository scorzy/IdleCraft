import { create } from 'zustand'
import { GameState } from './GameState'
import { InitialGameState } from './InitialGameState'

export const useGameStore = create<GameState>()(() => InitialGameState)

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
