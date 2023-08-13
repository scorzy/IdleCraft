import { AppShell } from './ui/shell/AppShell'
import { ThemeProvider } from './ui/themeProvider'

function App() {
    ThemeProvider()
    return <AppShell />
}

export default App
