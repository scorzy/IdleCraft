import { TbAlertTriangle } from 'react-icons/tb'
import { throttle } from 'es-toolkit/compat'
import { Start } from './game/Start'
import { useGameStore } from './game/state'
import { ToasterProvider } from './notification/ToasterProvider'
import { selectGameId, selectLoading } from './game/gameSelectors'
import { AppShell } from './ui/shell/AppShell'
import { ThemeProvider } from './ui/themeProvider'
import { GameState } from './game/GameState'
import { regenerate } from './game/regenerate'
import { Alert, AlertTitle, AlertDescription } from './components/ui/alert'

setInterval(() => {
    const gameId = useGameStore.getState().gameId
    if (gameId === '') return
    const loading = useGameStore.getState().loading
    if (loading) return
    useGameStore.setState((s) => regenerate(s, Date.now()))
}, 1e3)

if ('indexedDB' in window) {
    const open = window.indexedDB.open('IdleCraft', 1)

    const save: (state: GameState) => void = throttle((state: GameState) => {
        if (state.gameId === '') return
        if (state.loading) return
        const db = open.result
        const transaction = db.transaction('save', 'readwrite')
        const objectStore = transaction.objectStore('save')
        const putRes = objectStore.put(state)

        putRes.onerror = () => {
            console.log(`Save failed`)
        }
    }, 1e3)

    open.onupgradeneeded = () => {
        const db = open.result
        db.createObjectStore('save', { keyPath: 'gameId' })
    }
    open.onsuccess = () => {
        useGameStore.subscribe(save)
    }
}

function App() {
    ThemeProvider()
    ToasterProvider()

    const gameId = useGameStore(selectGameId)
    const loading = useGameStore(selectLoading)

    const ok = 'indexedDB' in window

    if (!ok)
        return (
            <div className="grid h-dvh items-center justify-center p-0">
                <Alert variant="destructive">
                    <TbAlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>indexedDB not found, please check your browser permission</AlertDescription>
                </Alert>
            </div>
        )

    if (gameId !== '' && !loading) return <AppShell />
    else return <Start />
}

export default App
