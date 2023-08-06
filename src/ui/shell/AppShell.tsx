import classes from './appShell.module.css'
import { useGameStore } from '../../game/state'
import { clsx } from 'clsx'
import { toggle } from '../state/uiFunctions'
import { UiPages } from '../state/UiPages'
import { ReactNode, memo } from 'react'
import { Woodcutting } from '../../wood/ui/Woodcutting'
import { Sidebar } from '../sidebar/Sidebar'
import { UiStorage } from '../../storage/ui/Storage'
import { useColorScheme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import { TbSunHigh, TbMoonStars, TbMenu2 } from 'react-icons/tb'
import { Activities } from '../../activities/ui/Activities'

export const AppShell = memo(function AppShell() {
    const open = useGameStore((s) => s.ui.open)
    const { mode, setMode } = useColorScheme()
    return (
        <div className={clsx(classes.container, { sideOpen: open }, { contentOpen: !open })}>
            <header className={classes.header}>
                <div>
                    <IconButton onClick={() => toggle()} aria-label="open menu" className={classes.menu}>
                        <TbMenu2 />
                    </IconButton>
                </div>
                <div>
                    <IconButton onClick={() => setMode(mode === 'light' ? 'dark' : 'light')} aria-label="change theme">
                        {mode === 'dark' ? <TbSunHigh /> : <TbMoonStars />}
                    </IconButton>
                </div>
            </header>

            <div className={classes.side}>
                <Sidebar />
            </div>

            <PageContent />
        </div>
    )
})

export const PageContent = memo(function PageContent() {
    const page = useGameStore((s) => s.ui.page)
    switch (page) {
        case UiPages.Woodcutting:
            return <Woodcutting />
        case UiPages.Storage:
            return <UiStorage />
        case UiPages.Activities:
            return <Activities />
    }
})

export const Page = memo(function PageWithSidebar(props: { children?: ReactNode }) {
    const { children } = props
    return (
        <div className={classes.page}>
            <div className={classes.content}>{children}</div>
        </div>
    )
})
export const PageWithSidebar = memo(function PageWithSidebar(props: { children?: ReactNode; sidebar: ReactNode }) {
    const { children, sidebar } = props
    return (
        <div className={classes.pageWithSide}>
            <div className={classes.side2}>{sidebar}</div>
            <div className={classes.content}>{children}</div>
        </div>
    )
})
