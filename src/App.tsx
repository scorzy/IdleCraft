import { AppShell } from './ui/AppShell'
import { useTheme } from './ui/useTheme'

function App() {
    useTheme()
    return <AppShell />
}

export default App
