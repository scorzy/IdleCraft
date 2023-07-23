import classes from './appShell.module.css'

import { useGameStore } from '../game/state'
import { clsx } from 'clsx'
import { Button } from './Button'
import { Sidebar } from './Sidebar'
import { UiVariants } from './state/UiVariants'
import { toggle, toggleTheme } from './state/uiFunctions'

export function AppShell() {
    const open = useGameStore((s) => s.ui.open)
    const dark = useGameStore((s) => s.ui.dark)

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
            <div className={classes.side2}>
                <Sidebar />
            </div>
            <div className={classes.content}>
                <span>content</span>
            </div>
        </div>
    )
}
