import { AppShell } from './ui/shell/AppShell'
import { useTheme } from './ui/useTheme'

function App() {
    useTheme()
    return <AppShell />
}

export default App
