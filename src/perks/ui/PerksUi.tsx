import { memo } from 'react'
import { Page } from '../../ui/shell/AppShell'
import { PerksEnum } from '../perksEnum'
import { useGameStore } from '../../game/state'
import { useTranslations } from '../../msg/useTranslations'
import { SidebarContainer } from '../../ui/sidebar/SidebarContainer'
import { toggleWood } from '../../ui/state/uiFunctions'
import { PerksData } from '../Perk'
import { SetPerk, acquirePerkClick } from '../PerksFunctions'
import { IsPerkEnabled, IsPerkSelected, SelectPerk } from '../PerksSelectors'
import { MyCard } from '../../ui/myCard/myCard'
import { Button, buttonVariants } from '../../components/ui/button'
import { cn } from '../../lib/utils'
import classes from './perkUi.module.css'

export const PerksPage = memo(function PerksPage() {
    return (
        <Page>
            <div className="my-container">
                <MyCard>
                    <PerksSidebar />
                </MyCard>
                <PerkPage />
            </div>
        </Page>
    )
})

const perks = Object.values(PerksEnum)
const len = perks.length
function PerksSidebar() {
    return (
        <>
            {perks.map((t, index) => (
                <PerkLink key={t} perk={t} isLast={index >= len - 1} />
            ))}
        </>
    )
}

function PerkLink(props: { perk: PerksEnum; isLast: boolean }) {
    const { perk, isLast } = props
    const data = PerksData[perk]
    const { t } = useTranslations()
    const selected = useGameStore(IsPerkSelected(perk))
    const enabled = useGameStore(IsPerkEnabled(perk))

    return (
        <>
            <button
                onClick={SetPerk(perk)}
                className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'w-full justify-start gap-4 font-normal',
                    { 'bg-muted': selected },
                    { [classes.itemDisabled]: !enabled },
                    classes.item
                )}
            >
                {data.icon}
                <span className="justify-self-start">{t[data.nameId]}</span>
            </button>

            {!isLast && <hr className={classes.hr} />}
        </>
    )
}

const PerkPage = () => {
    const perk = useGameStore(SelectPerk)
    const data = PerksData[perk]
    const { t } = useTranslations()
    return (
        <MyCard title={t[data.nameId]} icon={data.icon} actions={<PerkButton />}>
            {t[data.descId]}
        </MyCard>
    )
}

const PerkButton = () => {
    const perk = useGameStore(SelectPerk)
    const data = PerksData[perk]
    const { t } = useTranslations()
    return <Button onClick={acquirePerkClick(perk)}>Select</Button>
}
