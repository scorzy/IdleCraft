import { GameState } from './game/GameState'
import { Start } from './game/Start'
import { useGameStore } from './game/state'
import { ToasterProvider } from './notification/ToasterProvider'
import { AppShell } from './ui/shell/AppShell'
import { ThemeProvider } from './ui/themeProvider'

const selectGameId = (s: GameState) => s.gameId

function App() {
    ThemeProvider()
    ToasterProvider()

    const gameId = useGameStore(selectGameId)

    if (gameId !== '') return <AppShell />
    else return <Start />
}

export default App
