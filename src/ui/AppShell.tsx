import classes from './appShell.module.css'
import { useGameStore } from '../game/state'
import { clsx } from 'clsx'
import { toggle, toggleTheme } from './state/uiFunctions'
import { WoodcuttingSidebar } from '../wood/ui/WoodcuttingSidebar'
import { UiPages } from './state/UiPages'
import { memo } from 'react'
import { Woodcutting } from '../wood/ui/Woodcutting'
import { Button } from './button/Button'
import { Sidebar } from './sidebar/Sidebar'
import { UiStorage } from '../storage/ui/Storage'

export function AppShell() {
    const open = useGameStore((s) => s.ui.open)

    return (
        <div className={clsx(classes.container, { sideOpen: open }, { contentOpen: !open })}>
            <div className={classes.header}>
                <div>
                    <Button onClick={() => toggleTheme()}>Test</Button>
                </div>
                <div>
                    <button onClick={() => toggle()}>Open</button>
                    <button onClick={() => toggleTheme()}>Theme</button>
                </div>
            </div>
            <div className={classes.side}>
                <Sidebar />
            </div>
            <SecondSidebar />
            <div className={classes.content}>
                <Content />
            </div>
        </div>
    )
}

export const SecondSidebar = memo(() => {
    const page = useGameStore((s) => s.ui.page)
    switch (page) {
        case UiPages.Woodcutting:
            return (
                <div className={classes.side2}>
                    <WoodcuttingSidebar />
                </div>
            )
    }
})
SecondSidebar.displayName = 'SecondSidebar'

export const Content = memo(() => {
    const page = useGameStore((s) => s.ui.page)
    switch (page) {
        case UiPages.Woodcutting:
            return <Woodcutting />
        case UiPages.Storage:
            return <UiStorage />
    }
})
Content.displayName = 'Content'
