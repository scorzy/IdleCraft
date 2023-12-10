import { memo } from 'react'
import { Page } from '../../ui/shell/Page'
import { MyCard } from '../../ui/myCard/myCard'
import { useGameStore } from '../../game/state'
import {
    selectPlayerAvAttr,
    selectPlayerHealthPoints,
    selectPlayerManaPoints,
    selectPlayerMaxAttr,
    selectPlayerStaminaPoints,
    selectPlayerUsedAttr,
} from '../characterSelectors'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { Button } from '../../components/ui/button'
import { addHealthPointsClick, addManaPointClick, addStaminaPointClick } from '../characterFunctions'
import { PLAYER_ID } from '../charactersConst'
import { BonusDialog, BonusSpan } from '../../bonus/ui/BonusUi'
import { useTranslations } from '../../msg/useTranslations'
import { selectCharacterMaxHealth, selectCharacterMaxHealthList } from '../healthSelectors'
import { selectCharacterMaxStamina, selectCharacterMaxStaminaList } from '../staminaSelectors'
import { selectCharacterMaxMana, selectCharacterMaxManaList } from '../manaSelectors'
import classes from './PointsUi.module.css'

export const PointsUi = memo(function PointsUi() {
    return (
        <Page>
            <div className={classes.container}>
                <SetAttributes />
                <CharInfo />
            </div>
        </Page>
    )
})
const SetAttributes = memo(function SetAttributes() {
    const { f } = useNumberFormatter()
    const av = useGameStore(selectPlayerAvAttr)
    const used = useGameStore(selectPlayerUsedAttr)
    const total = useGameStore(selectPlayerMaxAttr)
    const healthPoints = useGameStore(selectPlayerHealthPoints)
    const staminaPoints = useGameStore(selectPlayerStaminaPoints)
    const manaPoints = useGameStore(selectPlayerManaPoints)
    const disabled = av < 1

    return (
        <MyCard className="w-64 block">
            <ul>
                <li>Attributes: {f(total)}</li>
                <li>Used: {f(used)}</li>
                <li>Available: {f(av)}</li>
            </ul>
            <div className={classes.buttons}>
                <Button size="sm" variant="health" disabled={disabled} onClick={addHealthPointsClick}>
                    + Health ({f(healthPoints)})
                </Button>
                <Button size="sm" variant="stamina" disabled={disabled} onClick={addStaminaPointClick}>
                    + Stamina ({f(staminaPoints)})
                </Button>
                <Button size="sm" variant="mana" disabled={disabled} onClick={addManaPointClick}>
                    + Mana ({f(manaPoints)})
                </Button>
            </div>
        </MyCard>
    )
})
const CharInfo = memo(function CharInfo() {
    const { f } = useNumberFormatter()
    const { t } = useTranslations()
    const maxH = useGameStore(selectCharacterMaxHealth(PLAYER_ID))
    const maxHB = useGameStore(selectCharacterMaxHealthList(PLAYER_ID))

    const maxS = useGameStore(selectCharacterMaxStamina(PLAYER_ID))
    const maxSB = useGameStore(selectCharacterMaxStaminaList(PLAYER_ID))

    const maxM = useGameStore(selectCharacterMaxMana(PLAYER_ID))
    const maxMB = useGameStore(selectCharacterMaxManaList(PLAYER_ID))
    return (
        <MyCard className="w-64 block" title="Stats">
            <BonusSpan>
                Health {f(maxH)} <BonusDialog title={t.Health} bonusResult={maxHB} />
            </BonusSpan>
            <BonusSpan>
                Stamina {f(maxS)} <BonusDialog title={t.Stamina} bonusResult={maxSB} />
            </BonusSpan>
            <BonusSpan>
                Mana {f(maxM)} <BonusDialog title={t.Mana} bonusResult={maxMB} />
            </BonusSpan>
        </MyCard>
    )
})
