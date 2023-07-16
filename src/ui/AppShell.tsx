import { useStore } from '../game/state'
import classes from './appShell.module.css'
import { clsx } from 'clsx'
import { Button } from './Button'
import { UiVariants } from './UiVariants'
import { Sidebar } from './Sidebar'

export function AppShell() {
    const open = useStore((s) => s.open)
    const toggle = useStore((s) => s.toggle)
    const dark = useStore((s) => s.dark)
    const toggleTheme = useStore((s) => s.toggleTheme)

    const theme = dark ? 'dark' : 'light'

    return (
        <div className={clsx(theme, 'primary', classes.container, { sideOpen: open }, { contentOpen: !open })}>
            <div className={classes.header}>
                <Button className="btn" onClick={() => toggle()} variant={UiVariants.Primary}>
                    Open
                </Button>
                <Button className="btn" onClick={() => toggleTheme()}>
                    Theme
                </Button>
            </div>
            <div className={classes.side}>
                <Sidebar />
            </div>
            <div className={classes.content}>content</div>
        </div>
    )
}
