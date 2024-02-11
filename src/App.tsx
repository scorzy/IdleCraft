import { Start } from './game/Start'
import { useGameStore } from './game/state'
import { ToasterProvider } from './notification/ToasterProvider'
import { selectGameId } from './game/gameSelectors'
import { AppShell } from './ui/shell/AppShell'
import { ThemeProvider } from './ui/themeProvider'
import { GameState } from './game/GameState'
import { regenerate } from './game/regenerate'

setInterval(() => {
    const gameId = useGameStore(selectGameId)
    if (gameId === '') return
    useGameStore.setState((s) => regenerate(s, Date.now()))
}, 1e3)

if ('indexedDB' in window) {
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

function App() {
    ThemeProvider()
    ToasterProvider()

    const gameId = useGameStore(selectGameId)

    if (gameId !== '') return <AppShell />
    else return <Start />
}

export default App
