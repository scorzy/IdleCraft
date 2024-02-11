import { Start } from './game/Start'
import { useGameStore } from './game/state'
import { ToasterProvider } from './notification/ToasterProvider'
import { selectGameId } from './game/gameSelectors'
import { AppShell } from './ui/shell/AppShell'
import { ThemeProvider } from './ui/themeProvider'

function App() {
    ThemeProvider()
    ToasterProvider()

    const gameId = useGameStore(selectGameId)

    if (gameId !== '') return <AppShell />
    else return <Start />
}

export default App
