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
import { sidebarOpen, toggle } from '../state/uiFunctions'
import { LuMenu } from 'react-icons/lu'
import { Mining } from '../../mining/ui/Mining'
import { UiPagesData } from '../state/UiPagesData'
import { useTranslations } from '../../msg/useTranslations'
import { CardTitle } from '../../components/ui/card'
import { PerksPage } from '../../perks/ui/PerksUi'

export const AppShell = memo(function AppShell() {
    const open = useGameStore(sidebarOpen)

    return (
        <div className={clsx(classes.container, { sideOpen: open }, { contentOpen: !open })}>
            <header className={classes.header}>
                <div className={classes.headerLeft}>
                    <Button onClick={() => toggle()} className={classes.menu} variant="outline">
                        <LuMenu />
                    </Button>
                    <Header />
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

export const Header = memo(function Header() {
    const page = useGameStore((s) => s.ui.page)
    const { t } = useTranslations()

    const uiPage = UiPagesData[page]
    if (!uiPage) return <></>
    return (
        <CardTitle>
            {uiPage.icon}
            {t[uiPage.nameId]}
        </CardTitle>
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
        case UiPages.Smithing:
            return <CraftingUi />
        case UiPages.Perks:
            return <PerksPage />
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
