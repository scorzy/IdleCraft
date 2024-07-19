import { clsx } from 'clsx'
import { memo } from 'react'
import { LuMenu } from 'react-icons/lu'
import { useGameStore } from '../../game/state'
import { UiPages } from '../state/UiPages'
import { Woodcutting } from '../../wood/ui/Woodcutting'
import { Sidebar } from '../sidebar/Sidebar'
import { UiStorage } from '../../storage/ui/Storage'
import { Activities } from '../../activities/ui/Activities'
import { CraftingUi } from '../../crafting/ui/CraftingUi'
import { ModeToggle } from '../modeToggle'
import { Button } from '../../components/ui/button'
import { sidebarOpen, toggle } from '../state/uiFunctions'
import { Mining } from '../../mining/ui/Mining'
import { UiPagesData } from '../state/UiPagesData'
import { useTranslations } from '../../msg/useTranslations'
import { CardTitle } from '../../components/ui/card'
import { CombatPage } from '../../battle/ui/BattleZoneUi'
import { CombatUi } from '../../battle/ui/CombatUi'
import { CharactersUi } from '../../characters/ui/CharactersUi'
import { DeadDialog } from '../../characters/ui/DeadDialog'
import classes from './appShell.module.css'

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

            <DeadDialog />
        </div>
    )
})

const Header = memo(function Header() {
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

const PageContent = memo(function PageContent() {
    const page = useGameStore((s) => s.ui.page)
    switch (page) {
        case UiPages.Woodcutting:
            return <Woodcutting />
        case UiPages.Storage:
            return <UiStorage />
        case UiPages.Activities:
            return <Activities />
        case UiPages.Mining:
            return <Mining />
        case UiPages.CombatZones:
            return <CombatPage />
        case UiPages.Combat:
            return <CombatUi />
        case UiPages.Characters:
            return <CharactersUi />

        case UiPages.Woodworking:
        case UiPages.Smithing:
        case UiPages.Butchering:
            return <CraftingUi />
    }
})
