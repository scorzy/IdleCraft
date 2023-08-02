import classes from './appShell.module.css'
import { useGameStore } from '../game/state'
import { clsx } from 'clsx'
import { Sidebar } from './Sidebar'
import { toggle } from './state/uiFunctions'
import Button from '@mui/joy/Button'
import { useColorScheme } from '@mui/joy'
import { WoodcuttingSidebar } from '../wood/ui/WoodcuttingSidebar'
import { UiPages } from './state/UiPages'
import { memo } from 'react'
import { Woodcutting } from '../wood/ui/Woodcutting'

export function AppShell() {
    const open = useGameStore((s) => s.ui.open)
    const { mode, setMode } = useColorScheme()

    return (
        <div className={clsx(classes.container, { sideOpen: open }, { contentOpen: !open })}>
            <div className={classes.header}>
                <div></div>
                <div>
                    <Button onClick={() => toggle()}>Open</Button>
                    <Button onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>Theme</Button>
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
    }
})
Content.displayName = 'Content'
