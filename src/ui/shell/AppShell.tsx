import classes from './appShell.module.css'
import { useGameStore } from '../../game/state'
import { clsx } from 'clsx'
import { UiPages } from '../state/UiPages'
import { ReactNode, memo } from 'react'
import { Woodcutting } from '../../wood/ui/Woodcutting'
import { Sidebar } from '../sidebar/Sidebar'
import { UiStorage } from '../../storage/ui/Storage'
import { Activities } from '../../activities/ui/Activities'
import { CraftingUi } from '../../crafting/ui/CraftingUi'
import { ModeToggle } from '../modeToggle'
import { Button } from '../../components/ui/button'
import { toggle } from '../state/uiFunctions'
import { LuMenu } from 'react-icons/lu'
import { Mining } from '../../mining/ui/Mining'

export const AppShell = memo(function AppShell() {
    const open = useGameStore((s) => s.ui.open)

    return (
        <div className={clsx(classes.container, { sideOpen: open }, { contentOpen: !open })}>
            <header className={classes.header}>
                <div>
                    <Button onClick={() => toggle()} className={classes.menu} variant="outline">
                        <LuMenu />
                    </Button>
                </div>
                <div>
                    <ModeToggle />
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
        case UiPages.Woodworking:
            return <CraftingUi />
        case UiPages.Mining:
            return <Mining />
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
