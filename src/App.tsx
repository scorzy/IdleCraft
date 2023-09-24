import { GameState } from './game/GameState'
import { Start } from './game/Start'
import { useGameStore } from './game/state'
import { AppShell } from './ui/shell/AppShell'
import { ThemeProvider } from './ui/themeProvider'

const selectGameId = (s: GameState) => s.gameId

function App() {
    ThemeProvider()

    const gameId = useGameStore(selectGameId)

    if (gameId !== '') return <AppShell />
    else return <Start />
}

export default App
