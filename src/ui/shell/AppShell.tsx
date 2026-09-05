import { clsx } from 'clsx'
import { memo, useCallback } from 'react'
import { LuMenu } from 'react-icons/lu'
import { Activities, ActivityProgress } from '../../activities/ui/Activities'
import { selectActivityIcon, selectActivityTitle } from '../../activities/ActivitySelectors'
import { CombatPage } from '../../battle/ui/BattleZoneUi'
import { CombatUi } from '../../battle/ui/CombatUi'
import { CaravanUi } from '../../caravans/ui/CaravanUi'
import { CharactersUi } from '../../characters/ui/CharactersUi'
import { DeadDialog } from '../../characters/ui/DeadDialog'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { CardTitle } from '../../components/ui/card'
import { CraftingUi } from '../../crafting/ui/CraftingUi'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { SaveExportDialog } from '../../game/save/ui/SaveExportDialog'
import { Gathering } from '../../gathering/ui/Gathering'
import { IconsData } from '../../icons/Icons'
import { Market } from '../../market/ui/Market'
import { Mining } from '../../mining/ui/Mining'
import { useTranslations } from '../../msg/useTranslations'
import { QuestUi } from '../../quests/ui/QuestUi'
import { UiStorage } from '../../storage/ui/Storage'
import { Woodcutting } from '../../wood/ui/Woodcutting'
import { World } from '../../gameLocations/ui/World'
import { Vendors } from '../../vendors/ui/Vendors'
import { ModeToggle } from '../modeToggle'
import { Sidebar } from '../sidebar/Sidebar'
import { UiPages } from '../state/UiPages'
import { UiPagesData } from '../state/UiPagesData'
import { sidebarOpen, toggle } from '../state/uiFunctions'
import classes from './appShell.module.css'
import { selectPage } from '../state/uiSelectors'
import { lockedIcon } from '../state/uiFunctions'
import { selectPageUnlocked } from '../state/pageUnlocks'
import { LockedPage } from '../pages/LockedPage'

export const AppShell = memo(function AppShell() {
    const open = useGameStore(sidebarOpen)

    return (
        <div className={clsx(classes.container, { sideOpen: open }, { contentOpen: !open })}>
            <Header />

            <div className={classes.side}>
                <Sidebar />
            </div>

            <PageContent />

            <DeadDialog />
        </div>
    )
})

const Header = memo(function Header() {
    return (
        <header className={classes.header}>
            <div className={classes.headerLeft}>
                <Button onClick={toggle} className={classes.menu} variant="outline">
                    <LuMenu />
                </Button>
                <HeaderTitle />
                <CurrentActivity />
            </div>
            <div className={classes.headerRight}>
                <SaveExportDialog />
                <ModeToggle />
            </div>
        </header>
    )
})

const CurrentActivity = memo(function CurrentActivity() {
    const activityId = useGameStore((state) => state.activityId)
    const title = useGameStore(
        useCallback(
            (state: GameState) => (activityId ? selectActivityTitle(activityId)(state) : undefined),
            [activityId]
        )
    )
    const icon = useGameStore(
        useCallback(
            (state: GameState) => (activityId ? selectActivityIcon(activityId)(state) : undefined),
            [activityId]
        )
    )
    if (!activityId) return null

    if (!title || !icon) return null

    return (
        <Badge variant="secondary" className={classes.currentActivity}>
            {IconsData[icon]}

            <span className={classes.currentActivityTitle}>{title}</span>
            <span className={classes.currentActivityProgress}>
                <ActivityProgress id={activityId} />
            </span>
        </Badge>
    )
})

const HeaderTitle = memo(function HeaderTitle() {
    const page = useGameStore(selectPage)
    const unlocked = useGameStore(selectPageUnlocked(page))
    const { t } = useTranslations()

    const uiPage = UiPagesData[page]
    if (!uiPage) return null
    return (
        <CardTitle className={classes.headerTitle}>
            {lockedIcon(uiPage.icon, unlocked)}
            {unlocked ? t[uiPage.nameId] : t.Locked}
        </CardTitle>
    )
})

const PageContent = memo(function PageContent() {
    const page = useGameStore(selectPage)
    const unlocked = useGameStore(selectPageUnlocked(page))
    if (!unlocked) return <LockedPage />

    switch (page) {
        case UiPages.Woodcutting:
            return <Woodcutting />
        case UiPages.Storage:
            return <UiStorage />
        case UiPages.Activities:
            return <Activities />
        case UiPages.Mining:
            return <Mining />
        case UiPages.Gathering:
            return <Gathering />
        case UiPages.World:
            return <World />
        case UiPages.CombatZones:
            return <CombatPage />
        case UiPages.Combat:
            return <CombatUi />
        case UiPages.Characters:
            return <CharactersUi />
        case UiPages.Quest:
            return <QuestUi />
        case UiPages.Caravans:
            return <CaravanUi />
        case UiPages.Market:
            return <Market />
        case UiPages.Vendors:
            return <Vendors />

        case UiPages.Woodworking:
        case UiPages.Smithing:
        case UiPages.Butchering:
        case UiPages.Alchemy:
            return <CraftingUi />
    }
})
